import { Fragment, useEffect, useRef, useState } from 'react'
import { getChapter } from '../nlt.js'
import { versesWithRefs } from '../xref.js'
import { bookById, BOOKS } from '../books.js'
import { containsVerse } from '../ref.js'

function neighbor(book, chapter, dir) {
  const b = bookById[book]
  if (dir > 0 && chapter < b.chapters) return { book, chapter: chapter + 1 }
  if (dir < 0 && chapter > 1) return { book, chapter: chapter - 1 }
  const i = BOOKS.findIndex((x) => x.id === book) + dir
  if (i < 0 || i >= BOOKS.length) return null
  return { book: BOOKS[i].id, chapter: dir > 0 ? 1 : BOOKS[i].chapters }
}

export default function Reader({ focus, selected, onSelectVerse, onNavigate }) {
  const { book, chapter } = focus
  const [state, setState] = useState({ status: 'loading', blocks: [] })
  const [hasRefs, setHasRefs] = useState(new Set())
  const scrollRef = useRef(null)

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, status: 'loading' }))
    getChapter(book, chapter)
      .then((blocks) => live && setState({ status: 'ready', blocks }))
      .catch((e) => live && setState({ status: 'error', blocks: [], error: e.message }))
    versesWithRefs(book, chapter).then((s) => live && setHasRefs(s))
    return () => { live = false }
  }, [book, chapter])

  // Bring the focused verse into view, or start at the top of a new chapter.
  useEffect(() => {
    if (state.status !== 'ready') return
    const el = focus.verse && scrollRef.current?.querySelector(`[data-v="${focus.verse}"]`)
    if (el) el.scrollIntoView({ block: 'center', behavior: 'smooth' })
    else scrollRef.current?.scrollTo({ top: 0 })
  }, [state, focus])

  const prev = neighbor(book, chapter, -1)
  const next = neighbor(book, chapter, 1)
  const name = bookById[book]?.name

  const verseProps = (v, first) => {
    const isFocus = containsVerse(focus, chapter, v)
    const isSel = selected?.book === book && selected?.chapter === chapter && selected?.verse === v
    return {
      'data-v': first ? v : undefined,
      className: `v ${isFocus ? 'focus' : ''} ${isSel ? 'sel' : ''}`,
      onClick: () => onSelectVerse({ book, chapter, verse: v }),
      onKeyDown: (e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onSelectVerse({ book, chapter, verse: v })),
      role: 'button',
      tabIndex: first ? 0 : -1,
      title: 'Show cross-references',
    }
  }
  const num = (v, first) => first && <sup className={`vn ${hasRefs.has(v) ? 'has-refs' : ''}`}>{v}</sup>

  return (
    <main className="reader" ref={scrollRef}>
      <article className="page">
        <header className="chapter-head">
          <p className="eyebrow">New Living Translation</p>
          <h1>{name} <span>{chapter}</span></h1>
          <p className="hint">Tap any verse to see its cross-references.</p>
        </header>

        {state.status === 'loading' && (
          <div className="skeleton" aria-label="Loading chapter">
            {Array.from({ length: 8 }, (_, i) => <span key={i} style={{ width: `${70 + ((i * 37) % 30)}%` }} />)}
          </div>
        )}
        {state.status === 'error' && (
          <div className="error">
            <p>Couldn’t load {name} {chapter} from the NLT API.</p>
            <p className="muted">{state.error}. Check your connection or API key, then try again.</p>
          </div>
        )}

        {state.status === 'ready' && (
          <div className="text">
            {state.blocks.map((b, i) => {
              if (b.type === 'heading') return <h2 key={i} className={`subhead ${b.kind}`} dangerouslySetInnerHTML={{ __html: b.html }} />
              if (b.type === 'line')
                return (
                  <p key={i} className={`poetry indent-${b.indent}`}>
                    <span {...verseProps(b.verse, b.first)}>
                      {num(b.verse, b.first)}
                      <span dangerouslySetInnerHTML={{ __html: b.html }} />
                    </span>
                  </p>
                )
              return (
                <p key={i} className="prose">
                  {b.segs.map((s, j) => (
                    <Fragment key={j}>
                      <span {...verseProps(s.verse, s.first)}>
                        {num(s.verse, s.first)}
                        <span dangerouslySetInnerHTML={{ __html: s.html }} />
                      </span>{' '}
                    </Fragment>
                  ))}
                </p>
              )
            })}
          </div>
        )}

        <nav className="pager" aria-label="Chapter navigation">
          {prev ? (
            <button onClick={() => onNavigate(prev)}>← {bookById[prev.book].name} {prev.chapter}</button>
          ) : <span />}
          {next && <button onClick={() => onNavigate(next)}>{bookById[next.book].name} {next.chapter} →</button>}
        </nav>
        <p className="copyright">
          Scripture quotations are taken from the Holy Bible, New Living Translation, copyright © 1996, 2004, 2015 by Tyndale House Foundation. Used by permission of Tyndale House Publishers, Carol Stream, Illinois 60188. All rights reserved.
        </p>
      </article>
    </main>
  )
}

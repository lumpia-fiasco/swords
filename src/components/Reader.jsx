import { Fragment, useEffect, useRef, useState } from 'react'
import { getChapter } from '../nlt.js'
import { versesWithRefs } from '../xref.js'
import { chapterNames, linkNames } from '../names.js'
import { bookById, BOOKS } from '../books.js'
import { containsVerse, label } from '../ref.js'

// Plain text of one verse's HTML pieces (footnote markers and tags removed).
function verseText(pieces) {
  const div = document.createElement('div')
  div.innerHTML = pieces.join(' ')
  div.querySelectorAll('.fn').forEach((el) => el.remove())
  return div.textContent.replace(/\s+/g, ' ').trim()
}

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text })
    document.body.append(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
  }
}

function neighbor(book, chapter, dir) {
  const b = bookById[book]
  if (dir > 0 && chapter < b.chapters) return { book, chapter: chapter + 1 }
  if (dir < 0 && chapter > 1) return { book, chapter: chapter - 1 }
  const i = BOOKS.findIndex((x) => x.id === book) + dir
  if (i < 0 || i >= BOOKS.length) return null
  return { book: BOOKS[i].id, chapter: dir > 0 ? 1 : BOOKS[i].chapters }
}

export default function Reader({ focus, onSelectVerse, onNavigate, onName }) {
  const { book, chapter } = focus
  const [state, setState] = useState({ status: 'loading', blocks: [] })
  const [hasRefs, setHasRefs] = useState(new Set())
  const [names, setNames] = useState(new Map())
  const scrollRef = useRef(null)
  // Verses selected for copying: { anchor, from, to } within this chapter.
  const [range, setRange] = useState(null)
  const [extending, setExtending] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let live = true
    setState((s) => ({ ...s, status: 'loading' }))
    getChapter(book, chapter)
      .then((blocks) => live && setState({ status: 'ready', blocks }))
      .catch((e) => live && setState({ status: 'error', blocks: [], error: e.message }))
    versesWithRefs(book, chapter).then((s) => live && setHasRefs(s))
    setNames(new Map())
    chapterNames(book, chapter).then((n) => live && setNames(n)).catch(() => {})
    return () => { live = false }
  }, [book, chapter])

  // A verse (or range) opened by link or lookup starts out selected.
  useEffect(() => {
    setExtending(false)
    setRange(focus.verse ? { anchor: focus.verse, from: focus.verse, to: focus.endVerse ?? focus.verse } : null)
  }, [focus])

  useEffect(() => {
    if (!range) return
    const onKey = (e) => e.key === 'Escape' && (setRange(null), setExtending(false))
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [range])

  const pick = (v, extend) => {
    if (extend && range) {
      setRange({ anchor: range.anchor, from: Math.min(range.anchor, v), to: Math.max(range.anchor, v) })
      setExtending(false)
      return
    }
    setRange({ anchor: v, from: v, to: v })
    onSelectVerse({ book, chapter, verse: v })
  }

  const copy = async () => {
    const pieces = new Map()
    for (const b of state.blocks) {
      for (const seg of b.type === 'para' ? b.segs : b.type === 'line' ? [b] : []) {
        if (seg.verse >= range.from && seg.verse <= range.to) pieces.set(seg.verse, [...(pieces.get(seg.verse) ?? []), seg.html])
      }
    }
    const verses = [...pieces].sort((a, b) => a[0] - b[0])
    const ref = label({ book, chapter, verse: range.from, endVerse: range.to > range.from ? range.to : undefined })
    const body = verses.length === 1 ? verseText(verses[0][1]) : verses.map(([v, p]) => `${v} ${verseText(p)}`).join(' ')
    await writeClipboard(`${body}\n— ${ref} (NLT)`)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

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
    const isSel = range && v >= range.from && v <= range.to
    return {
      'data-v': first ? v : undefined,
      className: `v ${isFocus ? 'focus' : ''} ${isSel ? 'sel' : ''}`,
      onClick: (e) => {
        if (openName(e)) return
        // Don't hijack a drag-to-select of the text itself.
        if (getSelection()?.toString()) return
        pick(v, extending || e.shiftKey || e.metaKey || e.ctrlKey)
      },
      onKeyDown: (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        if (!openName(e)) pick(v, extending || e.shiftKey)
      },
      role: 'button',
      tabIndex: first ? 0 : -1,
      title: 'Show cross-references',
    }
  }
  // A tapped name opens its details instead of selecting the verse.
  const openName = (e) => {
    const el = e.target.closest?.('[data-nm]')
    if (!el) return false
    e.stopPropagation()
    onName(el.dataset.nm.split(','), bookById[book].testament === 'NT')
    return true
  }
  const linked = (html, v) => ({ __html: linkNames(html, names.get(v)) })
  const num = (v, first) => first && <sup className={`vn ${hasRefs.has(v) ? 'has-refs' : ''}`}>{v}</sup>

  return (
    <main className="reader" ref={scrollRef}>
      <article className="page">
        <header className="chapter-head">
          <p className="eyebrow">New Living Translation</p>
          <h1>{name} <span>{chapter}</span></h1>
          <p className="hint">Tap a verse for cross-references and copying, or a name for its Hebrew meaning.</p>
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
                      <span dangerouslySetInnerHTML={linked(b.html, b.verse)} />
                    </span>
                  </p>
                )
              return (
                <p key={i} className="prose">
                  {b.segs.map((s, j) => (
                    <Fragment key={j}>
                      <span {...verseProps(s.verse, s.first)}>
                        {num(s.verse, s.first)}
                        <span dangerouslySetInnerHTML={linked(s.html, s.verse)} />
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

      {range && state.status === 'ready' && (
        <div className="selbar" role="toolbar" aria-label="Selected verses">
          <span className="selbar-ref">{label({ book, chapter, verse: range.from, endVerse: range.to > range.from ? range.to : undefined })}</span>
          <button className={`selbar-btn ${extending ? 'on' : ''}`} aria-pressed={extending} onClick={() => setExtending((x) => !x)} title="Then tap another verse (or shift-click)">
            {extending ? 'Tap a verse…' : 'Select more'}
          </button>
          <button className="selbar-btn primary" onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
          <button className="selbar-close" onClick={() => { setRange(null); setExtending(false) }} aria-label="Clear selection">✕</button>
        </div>
      )}
    </main>
  )
}

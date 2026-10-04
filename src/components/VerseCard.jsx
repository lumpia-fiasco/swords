import { useState } from 'react'
import { parseOsis, label, containsVerse } from '../ref.js'
import { getPassages } from '../nlt.js'
import { useVersion } from '../version.js'

const CONTEXT = 3

export default function VerseCard({ osis, verses, onOpen, meta }) {
  const version = useVersion()
  const ref = parseOsis(osis)
  const [ctx, setCtx] = useState(null) // null | 'loading' | [{verse, html}]

  const toggleContext = async (e) => {
    e.stopPropagation()
    if (ctx) return setCtx(null)
    setCtx('loading')
    const sameChapterEnd = !ref.endChapter || ref.endChapter === ref.chapter
    const around = {
      book: ref.book,
      chapter: ref.chapter,
      verse: Math.max(1, ref.verse - CONTEXT),
      endVerse: (sameChapterEnd ? ref.endVerse ?? ref.verse : ref.verse) + CONTEXT,
    }
    try {
      const map = await getPassages([around], version)
      setCtx([...map.values()][0] ?? [])
    } catch {
      setCtx(null)
    }
  }

  const open = () => onOpen(ref)

  return (
    <li className="card">
      <div className="card-body" role="button" tabIndex={0} onClick={open} onKeyDown={(e) => e.key === 'Enter' && open()}>
        <div className="card-head">
          <span className="card-ref">{label(ref)}</span>
          {meta}
        </div>
        {Array.isArray(ctx) ? (
          <p className="card-text context">
            {ctx.map((v) => (
              <span key={v.verse} className={containsVerse(ref, ref.chapter, v.verse) ? 'core' : 'around'}>
                <sup>{v.verse}</sup>
                <span dangerouslySetInnerHTML={{ __html: v.html }} />{' '}
              </span>
            ))}
          </p>
        ) : verses === undefined ? (
          <p className="card-text"><span className="shimmer" /><span className="shimmer short" /></p>
        ) : verses.length === 0 ? (
          <p className="card-text muted">Not found in this translation.</p>
        ) : (
          <p className="card-text">
            {verses.map((v, i) => (
              <span key={v.verse}>
                {verses.length > 1 && <sup>{v.verse}</sup>}
                <span dangerouslySetInnerHTML={{ __html: v.html }} />
                {i < verses.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="card-actions">
        <button type="button" onClick={toggleContext} aria-expanded={Array.isArray(ctx)}>
          {ctx === 'loading' ? 'Loading…' : Array.isArray(ctx) ? 'Hide context' : 'Show context'}
        </button>
        <button type="button" onClick={open}>Read chapter →</button>
      </div>
    </li>
  )
}

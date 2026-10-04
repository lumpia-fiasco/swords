import { useMemo, useRef, useState } from 'react'
import { bookById } from '../books.js'
import { parseTyped, label } from '../ref.js'
import { matchTopics } from '../topics.js'

export default function TopBar({ focus, onLookup, onOpenTopic, onToggleDrawer, onHome, version, onVersion }) {
  const [q, setQ] = useState('')
  const [active, setActive] = useState(-1)
  const [showSuggest, setShowSuggest] = useState(false)
  const inputRef = useRef(null)
  const book = bookById[focus.book]

  const suggestions = useMemo(() => {
    if (!q.trim()) return []
    const out = []
    const ref = parseTyped(q)
    if (ref) out.push({ kind: 'ref', label: label(ref), run: () => onLookup(q) })
    for (const t of matchTopics(q).slice(0, 4)) out.push({ kind: 'topic', label: t.title, run: () => onOpenTopic(t.id) })
    if (!ref) out.push({ kind: 'search', label: `Search NLT for “${q.trim()}”`, run: () => onLookup(q) })
    return out
  }, [q, onLookup, onOpenTopic])

  const run = (s) => {
    s.run()
    setQ('')
    setShowSuggest(false)
    inputRef.current?.blur()
  }

  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onToggleDrawer} aria-label="Books, topics and cross-references">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      </button>
      <a className="brand" href="#/John.3" onClick={onHome} aria-label="Mantles home">
        <svg className="brand-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* A flame: the fire of the Spirit. */}
          <path d="M12 2.5c.6 3.1 3.6 4.9 4.9 7.8 1.5 3.5.2 7.5-3.2 8.9-3.7 1.5-7.8-.6-8.4-4.4-.4-2.3.5-4.3 2-5.8.2 1.6 1 2.7 2.2 3.2C9.2 8.9 10.6 5.6 12 2.5Z" />
          <path d="M12 13.2c1 1.1 2.1 2.1 2.1 3.6a2.1 2.1 0 0 1-4.2 0c0-1.5 1.1-2.5 2.1-3.6Z" />
        </svg>
        <span>Mantles</span>
      </a>
      {book?.translation ? (
        <span className="tag" title="1 Enoch is shown in R. H. Charles’s translation">Charles</span>
      ) : (
        <div className="version-switch" role="radiogroup" aria-label="Translation">
          {['NLT', 'KJV'].map((v) => (
            <button key={v} role="radio" aria-checked={version === v} className={version === v ? 'on' : ''} onClick={() => onVersion(v)}>
              {v}
            </button>
          ))}
        </div>
      )}

      <form
        className="search"
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          if (active >= 0 && suggestions[active]) run(suggestions[active])
          else if (q.trim()) { onLookup(q); setQ(''); setShowSuggest(false); inputRef.current?.blur() }
        }}
      >
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(-1); setShowSuggest(true) }}
          onFocus={() => setShowSuggest(true)}
          onBlur={() => setTimeout(() => setShowSuggest(false), 120)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, suggestions.length - 1)) }
            if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)) }
            if (e.key === 'Escape') { setShowSuggest(false); e.currentTarget.blur() }
          }}
          placeholder="John 3:16, “healing”, or any word…"
          aria-label="Look up a verse, topic or word"
          autoComplete="off"
          spellCheck="false"
        />
        {showSuggest && suggestions.length > 0 && (
          <ul className="suggest" role="listbox">
            {suggestions.map((s, i) => (
              <li key={s.kind + s.label} role="option" aria-selected={i === active}>
                <button type="button" className={i === active ? 'active' : ''} onMouseDown={(e) => e.preventDefault()} onClick={() => run(s)}>
                  <span className={`kind kind-${s.kind}`}>{s.kind === 'ref' ? 'Verse' : s.kind === 'topic' ? 'Topic' : 'Words'}</span>
                  {s.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </form>

    </header>
  )
}

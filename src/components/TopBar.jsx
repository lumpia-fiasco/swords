import { useMemo, useRef, useState } from 'react'
import { BOOKS, bookById } from '../books.js'
import { parseTyped, label } from '../ref.js'
import { matchTopics } from '../topics.js'

export default function TopBar({ focus, onLookup, onOpenTopic, onNavigate, onToggleDrawer }) {
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
      <button className="icon-btn menu-btn" onClick={onToggleDrawer} aria-label="Toggle study panel">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
      </button>
      <a className="brand" href="#/John.3.16" aria-label="Mantles home">
        <svg className="brand-mark" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2c2.5 3 4.5 5.2 4.5 8.5A4.5 4.5 0 0 1 12 15a4.5 4.5 0 0 1-4.5-4.5C7.5 8.3 9 7 9.5 5c1 1.3 1.6 2.2 2.5 2.5C12 5.5 12 4 12 2Z" />
          <path d="M12 15v7M9 19h6" />
        </svg>
        <span>Mantles</span>
        <span className="tag">NLT</span>
      </a>

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

      <nav className="nav" aria-label="Book and chapter">
        <select value={focus.book} onChange={(e) => onNavigate({ book: e.target.value, chapter: 1 })} aria-label="Book">
          <optgroup label="Old Testament">
            {BOOKS.filter((b) => b.testament === 'OT').map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </optgroup>
          <optgroup label="New Testament">
            {BOOKS.filter((b) => b.testament === 'NT').map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </optgroup>
        </select>
        <select value={focus.chapter} onChange={(e) => onNavigate({ book: focus.book, chapter: +e.target.value })} aria-label="Chapter">
          {Array.from({ length: book?.chapters ?? 1 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
        </select>
      </nav>
    </header>
  )
}

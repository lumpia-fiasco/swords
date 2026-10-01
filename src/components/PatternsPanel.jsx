import { useEffect, useMemo, useRef, useState } from 'react'
import { PATTERNS, PATTERN_GROUPS, patternById } from '../patterns.js'
import { parseOsis, label } from '../ref.js'

const norm = (s) => s.toLowerCase().replace(/[’'`]/g, '')

function remembered() {
  try {
    return localStorage.getItem('pattern') ?? PATTERNS[0].id
  } catch {
    return PATTERNS[0].id
  }
}

function RefButton({ osis, focus, onOpen }) {
  const ref = parseOsis(osis)
  const on = focus.book === ref.book && focus.chapter === ref.chapter && focus.verse === ref.verse
  return (
    <button className={`pat-ref ${on ? 'on' : ''}`} onClick={() => onOpen(ref)} aria-pressed={on}>
      {label(ref)}
    </button>
  )
}

export default function PatternsPanel({ focus, onOpen, trayOpen, onToggleTray }) {
  const [group, setGroup] = useState('All')
  const [query, setQuery] = useState('')
  const [currentId, setCurrentId] = useState(remembered)
  // Narrow screens show the list or the detail, not both.
  const [showDetail, setShowDetail] = useState(false)
  const current = patternById[currentId] ?? PATTERNS[0]
  const listRef = useRef(null)

  // Keep the selected pattern visible in the list when the panel opens. Scroll only the list:
  // scrollIntoView would also scroll the collapsed panel and shift its header out of place.
  useEffect(() => {
    const list = listRef.current
    const item = list?.querySelector('.pat-item.on')
    if (!trayOpen || !item) return
    const top = item.offsetTop
    if (top < list.scrollTop || top + item.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = top - 8
  }, [currentId, trayOpen, group])

  const list = useMemo(() => {
    const q = norm(query.trim())
    return PATTERNS.filter((p) => {
      if (group !== 'All' && p.group !== group) return false
      if (!q) return true
      return norm(`${p.a} ${p.b} ${p.summary} ${p.rows.map((r) => r.point).join(' ')}`).includes(q)
    })
  }, [group, query])

  const pick = (id) => {
    setCurrentId(id)
    setShowDetail(true)
    try { localStorage.setItem('pattern', id) } catch {}
    if (!trayOpen) onToggleTray(true)
  }

  return (
    <section className={`patterns ${trayOpen ? 'tray-open' : ''} ${showDetail ? 'show-detail' : ''}`} aria-label="Patterns in Scripture">
      <header className="pat-head">
        <button className="pat-handle" onClick={() => onToggleTray(!trayOpen)} aria-expanded={trayOpen}>
          <span className="pat-title">Patterns</span>
          {/* Open: a fixed subtitle. Collapsed: what's selected. */}
          <span className="pat-sub docked">Shadows and their fulfillment</span>
          <span className="pat-sub tray">{current.a} → {current.b}</span>
          <svg className="pat-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m6 15 6-6 6 6" /></svg>
        </button>
        <div className="pat-groups" role="tablist" aria-label="Pattern groups">
          {['All', ...PATTERN_GROUPS].map((g) => (
            <button key={g} role="tab" aria-selected={group === g} className={`pat-group ${group === g ? 'on' : ''}`} onClick={() => { setGroup(g); setShowDetail(false) }}>
              {g}
            </button>
          ))}
        </div>
        <input
          className="pat-search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDetail(false) }}
          placeholder="Find a pattern…"
          aria-label="Find a pattern"
        />
      </header>

      <div className="pat-body">
        <nav className="pat-list" aria-label="Patterns" ref={listRef}>
          {list.length === 0 && <p className="muted pat-empty">No patterns match.</p>}
          {list.map((p) => (
            <button key={p.id} className={`pat-item ${p.id === current.id ? 'on' : ''}`} onClick={() => pick(p.id)}>
              <span className="pat-a">{p.a}</span>
              <span className="pat-b">{p.b}</span>
            </button>
          ))}
        </nav>

        <article className="pat-detail" key={current.id}>
          <button className="back pat-back" onClick={() => setShowDetail(false)}>← All patterns</button>
          <p className="eyebrow">{current.group}</p>
          <h2 className="pat-heading">
            <span>{current.a}</span>
            <span className="pat-arrow" aria-hidden="true">→</span>
            <span className="pat-fulfilled">{current.b}</span>
          </h2>
          <p className="pat-summary">{current.summary}</p>
          <div className="pat-table" role="table" aria-label={`${current.a} and ${current.b}`}>
            <div className="pat-row pat-row-head" role="row">
              <span role="columnheader" />
              <span role="columnheader">Shadow</span>
              <span role="columnheader">Fulfillment</span>
            </div>
            {current.rows.map((r, i) => (
              <div className="pat-row" role="row" key={i}>
                <span className="pat-point" role="cell">{r.point}</span>
                <span className="pat-refs" role="cell" data-label="Shadow">
                  {r.a.map((o) => <RefButton key={o} osis={o} focus={focus} onOpen={onOpen} />)}
                </span>
                <span className="pat-refs fulfilled" role="cell" data-label="Fulfillment">
                  {r.b.map((o) => <RefButton key={o} osis={o} focus={focus} onOpen={onOpen} />)}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

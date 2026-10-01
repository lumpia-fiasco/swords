import { useEffect, useState } from 'react'
import { TOPICS, topicById, topicsForVerse } from '../topics.js'
import { getPassages, search } from '../nlt.js'
import { getCrossRefs } from '../xref.js'
import { bookById } from '../books.js'
import { label, parseOsis } from '../ref.js'
import VerseCard from './VerseCard.jsx'

// Fetches verse text for a list of refs in one batched request.
function usePassages(refs) {
  const key = refs.join(';')
  const [map, setMap] = useState(new Map())
  const [error, setError] = useState(null)
  useEffect(() => {
    let live = true
    setMap(new Map())
    setError(null)
    if (refs.length) getPassages(refs).then((m) => live && setMap(m)).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [key])
  return { map, error }
}

export default function Sidebar({ panel, setPanel, selected, onOpen, onClose }) {
  const tabs = [
    ['topics', 'Topics'],
    ['xref', 'Cross-references'],
    ...(panel.query ? [['search', 'Search']] : []),
  ]
  return (
    <aside className="sidebar" aria-label="Study panel">
      <div className="tabs" role="tablist">
        {tabs.map(([id, name]) => (
          <button key={id} role="tab" aria-selected={panel.tab === id} className={panel.tab === id ? 'on' : ''} onClick={() => setPanel((p) => ({ ...p, tab: id }))}>
            {name}
          </button>
        ))}
        <button className="icon-btn close-btn" onClick={onClose} aria-label="Close study panel">✕</button>
      </div>
      <div className="panel">
        {panel.tab === 'topics' && (
          <TopicsPanel topicId={panel.topicId} onPick={(id) => setPanel((p) => ({ ...p, topicId: id }))} onOpen={onOpen} />
        )}
        {panel.tab === 'xref' && (
          <XrefPanel selected={selected} onOpen={onOpen} onTopic={(id) => setPanel((p) => ({ ...p, tab: 'topics', topicId: id }))} />
        )}
        {panel.tab === 'search' && <SearchPanel query={panel.query} onOpen={onOpen} />}
      </div>
    </aside>
  )
}

function TopicsPanel({ topicId, onPick, onOpen }) {
  const topic = topicById[topicId]
  if (!topic) {
    return (
      <div className="topic-index">
        <p className="panel-intro">Study the Word by theme. Each topic gathers verses with their full text — open any one to read it in its chapter.</p>
        <ul className="topic-list">
          {TOPICS.map((t) => (
            <li key={t.id}>
              <button onClick={() => onPick(t.id)}>
                <span className="topic-title">{t.title}</span>
                <span className="topic-count">{t.sections.reduce((n, s) => n + s.refs.length, 0)} verses</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return <TopicView key={topic.id} topic={topic} onBack={() => onPick(null)} onOpen={onOpen} />
}

function TopicView({ topic, onBack, onOpen }) {
  const refs = topic.sections.flatMap((s) => s.refs)
  const { map, error } = usePassages(refs)
  const [jump, setJump] = useState('')
  return (
    <div>
      <button className="back" onClick={onBack}>← All topics</button>
      <h2 className="panel-title">{topic.title}</h2>
      <p className="panel-intro">{topic.blurb}</p>
      <div className="section-jump">
        <select value={jump} aria-label="Jump to section" onChange={(e) => { setJump(e.target.value); document.getElementById(e.target.value)?.scrollIntoView({ behavior: 'smooth' }) }}>
          <option value="">Jump to section ({topic.sections.length})</option>
          {topic.sections.map((s, i) => <option key={i} value={`sec-${topic.id}-${i}`}>{s.heading}</option>)}
        </select>
      </div>
      {error && <p className="error small">Couldn’t load verse text: {error}</p>}
      {topic.sections.map((s, i) => (
        <section key={i} id={`sec-${topic.id}-${i}`} className="group">
          <h3>{s.heading} <span className="count">{s.refs.length}</span></h3>
          <ul className="cards">
            {s.refs.map((r) => <VerseCard key={r} osis={r} verses={error ? [] : map.get(r)} onOpen={onOpen} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}

function XrefPanel({ selected, onOpen, onTopic }) {
  const [xrefs, setXrefs] = useState(null)
  useEffect(() => {
    let live = true
    setXrefs(null)
    if (selected) getCrossRefs(selected.book, selected.chapter, selected.verse).then((x) => live && setXrefs(x))
    return () => { live = false }
  }, [selected?.book, selected?.chapter, selected?.verse])

  const selOsis = selected ? `${selected.book}.${selected.chapter}.${selected.verse}` : null
  const refs = [...(selOsis ? [selOsis] : []), ...(xrefs ?? []).map((x) => x.ref)]
  const { map, error } = usePassages(xrefs ? refs : [])

  if (!selected) {
    return <p className="panel-intro">Tap a verse in the reader, or look one up above, to see related passages across Scripture.</p>
  }

  const topics = topicsForVerse(selected.book, selected.chapter, selected.verse)
  const isOT = (r) => bookById[parseOsis(r).book]?.testament === 'OT'
  const groups = xrefs
    ? [['Old Testament', xrefs.filter((x) => isOT(x.ref))], ['New Testament', xrefs.filter((x) => !isOT(x.ref))]].filter(([, l]) => l.length)
    : []
  const maxVotes = Math.max(1, ...(xrefs ?? []).map((x) => x.votes))

  return (
    <div>
      <div className="selected-verse">
        <p className="eyebrow">Selected verse</p>
        <h2 className="panel-title">{label(selected)}</h2>
        <p className="card-text">
          {map.get(selOsis)?.map((v) => <span key={v.verse} dangerouslySetInnerHTML={{ __html: v.html }} />) ?? <><span className="shimmer" /><span className="shimmer short" /></>}
        </p>
        {topics.length > 0 && (
          <div className="chips">
            <span className="chips-label">In topics</span>
            {topics.map(({ topic, section }) => (
              <button key={topic.id} className="chip" onClick={() => onTopic(topic.id)} title={section}>{topic.title}</button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="error small">Couldn’t load verse text: {error}</p>}
      {xrefs === null && <p className="muted">Finding related verses…</p>}
      {xrefs?.length === 0 && <p className="muted">No cross-references for this verse yet. Try a neighboring verse.</p>}
      {groups.map(([name, list]) => (
        <section key={name} className="group">
          <h3>{name} <span className="count">{list.length}</span></h3>
          <ul className="cards">
            {list.map((x) => (
              <VerseCard
                key={x.ref}
                osis={x.ref}
                verses={error ? [] : map.get(x.ref)}
                onOpen={onOpen}
                meta={<span className="strength" title={`${x.votes} community votes`} style={{ '--s': x.votes / maxVotes }} />}
              />
            ))}
          </ul>
        </section>
      ))}
      {xrefs?.length > 0 && <p className="attribution">Cross-references from <a href="https://www.openbible.info/labs/cross-references/" target="_blank" rel="noreferrer">OpenBible.info</a>, ranked by community votes.</p>}
    </div>
  )
}

const PAGE = 50

function SearchPanel({ query, onOpen }) {
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const [shown, setShown] = useState(PAGE)
  useEffect(() => {
    let live = true
    setResults(null)
    setError(null)
    setShown(PAGE)
    search(query).then((r) => live && setResults(r)).catch((e) => live && setError(e.message))
    return () => { live = false }
  }, [query])

  return (
    <div>
      <h2 className="panel-title">“{query}”</h2>
      {error && <p className="error small">Search failed: {error}</p>}
      {!results && !error && <p className="muted">Searching the NLT…</p>}
      {results && results.length > 0 && <p className="panel-intro">{results.length} {results.length === 1 ? 'verse' : 'verses'} found</p>}
      {results?.length === 0 && (
        <p className="panel-intro">No NLT verses contain all of those words. The NLT often phrases things differently than older translations — try fewer or simpler words.</p>
      )}
      <ul className="cards">
        {results?.slice(0, shown).map((r) => (
          <VerseCard key={r.ref} osis={r.ref} verses={[{ verse: 0, html: escapeHtml(r.text) }]} onOpen={onOpen} />
        ))}
      </ul>
      {results && results.length > shown && <button className="more" onClick={() => setShown((s) => s + PAGE)}>Show more</button>}
    </div>
  )
}

const escapeHtml = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c])

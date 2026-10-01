import { useCallback, useEffect, useRef, useState } from 'react'
import { parseOsis, toOsis, parseTyped } from './ref.js'
import { matchTopics } from './topics.js'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Reader from './components/Reader.jsx'
import NamePanel from './components/NamePanel.jsx'

// With no verse in the URL, open on a chapter (no verse selected) and the topic list.
const DEFAULT = { book: 'John', chapter: 3 }

function readHash() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ''))
  if (!h) return DEFAULT
  try {
    const ref = parseOsis(h)
    return ref.book && ref.chapter ? ref : DEFAULT
  } catch {
    return DEFAULT
  }
}

export default function App() {
  const [focus, setFocus] = useState(readHash)
  // The verse whose cross-references the sidebar shows.
  const [selected, setSelected] = useState(() => (focus.verse ? { book: focus.book, chapter: focus.chapter, verse: focus.verse } : null))
  // A link to a specific verse opens straight to its cross-references.
  // The topic list by default; a verse in the URL opens straight to its cross-references.
  const [panel, setPanel] = useState({ tab: focus.verse ? 'xref' : 'topics', topicId: null, query: '' })
  const [drawerOpen, setDrawerOpen] = useState(false)
  // Name tapped in the reader: { ids, nt } shown in the right panel.
  const [nameView, setNameView] = useState(null)
  // Hash the app set itself, so in-app navigation isn't mistaken for a followed link.
  const ownHash = useRef(null)

  useEffect(() => {
    const onHash = () => {
      const ref = readHash()
      setFocus(ref)
      if (location.hash === ownHash.current || !ref.verse) return
      setSelected({ book: ref.book, chapter: ref.chapter, verse: ref.verse })
      setPanel((p) => ({ ...p, tab: 'xref' }))
    }
    addEventListener('hashchange', onHash)
    return () => removeEventListener('hashchange', onHash)
  }, [])

  const open = useCallback((ref, { showRefs = true } = {}) => {
    ownHash.current = `#/${toOsis(ref)}`
    location.hash = ownHash.current
    // A new object re-triggers scroll-to-verse even when the hash is unchanged.
    setFocus({ ...ref })
    if (ref.verse && showRefs) setSelected({ book: ref.book, chapter: ref.chapter, verse: ref.verse })
    setDrawerOpen(false)
  }, [])

  const selectVerse = useCallback((v) => {
    setSelected(v)
    setPanel((p) => ({ ...p, tab: 'xref' }))
    if (matchMedia('(max-width: 900px)').matches) setDrawerOpen(true)
  }, [])

  const lookup = useCallback(
    (input) => {
      const q = input.trim()
      if (!q) return
      const ref = parseTyped(q)
      if (ref) {
        open(ref)
        if (ref.verse) setPanel((p) => ({ ...p, tab: 'xref' }))
        return
      }
      const [topic] = matchTopics(q)
      if (topic) {
        setPanel({ tab: 'topics', topicId: topic.id, query: '' })
        setDrawerOpen(true)
        return
      }
      setPanel({ tab: 'search', topicId: panel.topicId, query: q })
      setDrawerOpen(true)
    },
    [open, panel.topicId],
  )

  return (
    <div className={`app ${drawerOpen ? 'drawer-open' : ''} ${nameView ? 'names-open' : ''}`}>
      <TopBar
        focus={focus}
        onLookup={lookup}
        onOpenTopic={(id) => { setPanel({ tab: 'topics', topicId: id, query: '' }); setDrawerOpen(true) }}
        onNavigate={(ref) => open(ref, { showRefs: false })}
        onToggleDrawer={() => setDrawerOpen((o) => !o)}
        onHome={() => { setSelected(null); setPanel({ tab: 'topics', topicId: null, query: '' }) }}
      />
      <Sidebar
        panel={panel}
        setPanel={setPanel}
        selected={selected}
        onOpen={open}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="scrim" onClick={() => setDrawerOpen(false)} />
      <Reader
        focus={focus}
        onSelectVerse={selectVerse}
        onNavigate={(ref) => open(ref, { showRefs: false })}
        onName={(ids, nt) => setNameView({ ids, nt })}
      />
      <NamePanel view={nameView} onClose={() => setNameView(null)} onOpen={(ref) => open(ref)} />
    </div>
  )
}

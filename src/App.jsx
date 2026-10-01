import { useCallback, useEffect, useRef, useState } from 'react'
import { parseOsis, toOsis, parseTyped } from './ref.js'
import { matchTopics } from './topics.js'
import TopBar from './components/TopBar.jsx'
import Sidebar from './components/Sidebar.jsx'
import Reader from './components/Reader.jsx'

const DEFAULT = { book: 'John', chapter: 3, verse: 16 }

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
  const [panel, setPanel] = useState({ tab: focus.verse ? 'xref' : 'topics', topicId: 'promises', query: '' })
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    <div className={`app ${drawerOpen ? 'drawer-open' : ''}`}>
      <TopBar
        focus={focus}
        onLookup={lookup}
        onOpenTopic={(id) => { setPanel({ tab: 'topics', topicId: id, query: '' }); setDrawerOpen(true) }}
        onNavigate={(ref) => open(ref, { showRefs: false })}
        onToggleDrawer={() => setDrawerOpen((o) => !o)}
      />
      <Sidebar
        panel={panel}
        setPanel={setPanel}
        selected={selected}
        onOpen={open}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="scrim" onClick={() => setDrawerOpen(false)} />
      <Reader focus={focus} selected={selected} onSelectVerse={selectVerse} onNavigate={(ref) => open(ref, { showRefs: false })} />
    </div>
  )
}

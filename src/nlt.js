// Client for Tyndale's NLT API (https://api.nlt.to). Requests go through /nlt,
// which the dev server (and any production proxy) forwards with the API key attached.
import { toOsis, parseOsis } from './ref.js'

const cache = new Map()

async function get(path) {
  if (cache.has(path)) return cache.get(path)
  const p = fetch(`/nlt${path}`).then((r) => {
    if (!r.ok) throw new Error(`NLT API error ${r.status}`)
    return r.text()
  })
  cache.set(path, p)
  p.catch(() => cache.delete(path))
  return p
}

const parser = new DOMParser()
const fragment = (html) => parser.parseFromString(`<body>${html}</body>`, 'text/html').body

// The API leaves <p> tags open across verse boundaries, which makes a normal HTML parse
// nest later verses inside earlier ones. So split on the raw markup first, then parse each
// verse on its own. Returns sections → [{ chapter, verse, node }].
function parseSections(html) {
  return [...html.matchAll(/<section>([\s\S]*?)<\/section>/g)].map(([, body]) =>
    [...body.matchAll(/<verse_export([^>]*)>([\s\S]*?)<\/verse_export>/g)].map(([, attrs, inner]) => ({
      chapter: +(attrs.match(/\bch="(\d+)"/)?.[1] ?? 0),
      verse: +(attrs.match(/\bvn="(\d+)"/)?.[1] ?? 0),
      node: fragment(inner),
    })),
  )
}

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// Re-emits API markup with only the inline styling we use. Footnotes become hover markers.
function inline(node, opts = {}) {
  let out = ''
  for (const n of node.childNodes) {
    if (n.nodeType === 3) { out += esc(n.textContent); continue }
    if (n.nodeType !== 1) continue
    const cls = n.getAttribute('class') ?? ''
    const tag = n.tagName.toLowerCase()
    if (cls === 'vn' || cls === 'a-tn' || /^h\d$/.test(tag)) continue
    if (cls === 'tn') {
      if (opts.notes === false) continue
      const note = n.textContent.replace(/\s+/g, ' ').trim()
      out += `<sup class="fn" tabindex="0" data-note="${esc(note)}">✱</sup>`
      continue
    }
    const inner = inline(n, opts)
    if (cls === 'red') out += `<span class="red">${inner}</span>`
    else if (cls === 'sc' || cls === 'subhead-sc') out += `<span class="sc">${inner}</span>`
    else if (tag === 'em' || tag === 'i') out += `<em>${inner}</em>`
    else if (tag === 'b' || tag === 'strong') out += `<strong>${inner}</strong>`
    else out += inner
  }
  return out
}

const HEADING_CLASSES = /subhead|psa-title|psa-hebrew|chapter-heading|book-name|intro-title/

/**
 * Converts one API <section> into reader blocks:
 *   { type: 'heading', html, kind }
 *   { type: 'para', segs: [{ chapter, verse, html }] }
 *   { type: 'line', chapter, verse, html, indent, first }   (poetry)
 */
function toBlocks(verses) {
  const blocks = []
  let para = null
  const seen = new Set()
  for (const { chapter, verse, node } of verses) {
    const key = `${chapter}.${verse}`
    const first = () => (seen.has(key) ? false : (seen.add(key), true))
    for (const n of node.childNodes) {
      if (n.nodeType === 3) {
        if (!n.textContent.trim()) continue
        if (!para) blocks.push((para = { type: 'para', segs: [] }))
        para.segs.push({ chapter, verse, html: esc(n.textContent), first: first() })
        continue
      }
      if (n.nodeType !== 1) continue
      const cls = n.getAttribute('class') ?? ''
      const tag = n.tagName.toLowerCase()
      if (cls.includes('chapter-number')) continue
      if (/^h\d$/.test(tag) || HEADING_CLASSES.test(cls)) {
        para = null
        blocks.push({ type: 'heading', html: inline(n), kind: cls.includes('psa') ? 'note' : 'sub' })
        continue
      }
      const html = inline(n)
      if (!html.trim()) continue
      if (tag === 'p' && cls.startsWith('poet')) {
        para = null
        const indent = cls.startsWith('poet2') ? 2 : cls.startsWith('poet3') ? 3 : 1
        blocks.push({ type: 'line', chapter, verse, html, indent, first: first() })
      } else if (tag === 'p') {
        blocks.push((para = { type: 'para', segs: [{ chapter, verse, html, first: first() }] }))
      } else {
        // Loose inline markup (a verse continuing the previous paragraph).
        const loose = inline({ childNodes: [n] })
        if (!loose.trim()) continue
        if (!para) blocks.push((para = { type: 'para', segs: [] }))
        para.segs.push({ chapter, verse, html: loose, first: first() })
      }
    }
  }
  return blocks
}

function plainText(verses) {
  return verses.map(({ verse, node }) => {
    node.querySelectorAll('h1,h2,h3,h4,h5,.psa-title,.psa-hebrew,[class*=subhead]').forEach((e) => e.remove())
    return { verse, html: inline(node, { notes: false }).replace(/\s+/g, ' ').trim() }
  })
}

export async function getChapter(book, chapter) {
  const html = await get(`/api/passages?version=NLT&ref=${toOsis({ book, chapter }, true)}`)
  const [verses] = parseSections(html)
  if (!verses?.length) throw new Error('Chapter not found')
  return toBlocks(verses)
}

/** Fetches many refs in one request. Returns Map<osis, [{verse, html}]>. */
export async function getPassages(refs) {
  const out = new Map()
  const list = refs.map((r) => (typeof r === 'string' ? parseOsis(r) : r))
  // Keep URLs a sane length.
  for (let i = 0; i < list.length; i += 40) {
    const chunk = list.slice(i, i + 40)
    const html = await get(`/api/passages?version=NLT&ref=${chunk.map((r) => toOsis(r, true)).join(';')}`)
    const sections = parseSections(html)
    chunk.forEach((r, j) => {
      if (sections[j]) out.set(toOsis(r), plainText(sections[j]))
    })
  }
  return out
}

/** Keyword search. Returns [{ ref, text }]. */
export async function search(text) {
  const doc = parser.parseFromString(await get(`/api/search?version=NLT&text=${encodeURIComponent(text)}`), 'text/html')
  return [...doc.querySelectorAll('tr')]
    .map((tr) => {
      const a = tr.querySelector('a')
      const td = tr.querySelectorAll('td')[1]
      if (!a || !td) return null
      // The API prefixes a section heading on its own line when a verse starts a section.
      const lines = td.textContent.split('\n').map((l) => l.trim()).filter(Boolean)
      return { ref: normalizeSearchRef(a.textContent.trim()), heading: lines.length > 1 ? lines[0] : null, text: lines.slice(lines.length > 1 ? 1 : 0).join(' ') }
    })
    .filter(Boolean)
}

const FROM_API = { '1Jn': '1John', '2Jn': '2John', '3Jn': '3John', '1Th': '1Thess', '2Th': '2Thess' }
function normalizeSearchRef(s) {
  const [bk, ...rest] = s.split('.')
  return [FROM_API[bk] ?? bk, ...rest].join('.')
}

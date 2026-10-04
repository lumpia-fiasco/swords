// Client for Tyndale's NLT API (https://api.nlt.to), which serves the NLT and the KJV. Requests go through /nlt,
// which the dev server (and any production proxy) forwards with the API key attached.
import { toOsis, parseOsis } from './ref.js'

const cache = new Map()
const CACHE_VERSION = 2

async function get(path) {
  if (cache.has(path)) return cache.get(path)
  // CACHE_VERSION is part of the URL so a bad response cached by the CDN can be retired by
  // bumping it. The proxy strips it before calling the NLT API.
  const p = fetch(`/nlt${path}${path.includes('?') ? '&' : '?'}cv=${CACHE_VERSION}`)
    .then((r) => {
      if (!r.ok) throw new Error(r.status === 502 ? 'The NLT API returned no text' : `NLT API error ${r.status}`)
      return r.text()
    })
    .then((text) => {
      // The API occasionally answers with an empty page; don't keep that as the passage.
      if (path.startsWith('/api/passages') && !/<verse_export|class="vn"/.test(text)) throw new Error('The NLT API returned no text')
      return text
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
// KJV responses have no per-verse wrappers: verses are marked only by <span class="vn">N</span>,
// and the passage headers/sections around them aren't reliable (a header is sometimes missing
// or misplaced). So ignore the headers and sections: cut the text at each verse number into an
// ordered list of verses, then match them to the references that were asked for.
function kjvVerses(html) {
  const start = html.indexOf('<div id="bibletext"')
  const body = (start < 0 ? html : html.slice(start))
    .replace(/<\/div>\s*<\/body>[\s\S]*$/, '')
    .replace(/<h2 class="bk_ch_vs_header">[^<]*<\/h2>/g, '')
    .replace(/<p class="chapter-number">[\s\S]*?<\/p>/g, '')
    .replace(/<\/?(section|div)[^>]*>/g, '')
  const out = []
  // Whatever precedes a verse number (a psalm title, a subhead, the <p> that opens it) goes with it.
  const re = /(<p[^>]*>)?\s*<span class="vn">(\d+)<\/span>/g
  let lead = ''
  let last = 0
  let m
  while ((m = re.exec(body))) {
    if (out.length) out.at(-1).html += body.slice(last, m.index)
    else lead = body.slice(last, m.index)
    out.push({ verse: +m[2], html: (out.length ? '' : lead) + (m[1] ?? '') })
    last = re.lastIndex
  }
  if (out.length) out.at(-1).html += body.slice(last)
  return out
}

// Assign KJV verses, in order, to the requested refs. If a ref's first verse isn't next in line,
// look a couple of verses ahead for it; failing that, the ref gets nothing rather than shifting
// every later passage.
function kjvAssign(verses, refs) {
  let i = 0
  return refs.map((r) => {
    const first = r.verse ?? 1
    const j = verses.findIndex((v, k) => k >= i && k <= i + 2 && v.verse === first)
    if (j < 0) return []
    i = j
    const items = []
    const endCh = r.endChapter ?? r.chapter
    const endVs = r.endVerse ?? (r.verse ? r.verse : Infinity)
    let chapter = r.chapter
    while (i < verses.length) {
      const v = verses[i].verse
      if (items.length && v <= items.at(-1).verse) {
        // A range across chapters continues at verse 1; any other drop starts the next passage.
        if (chapter < endCh && v === 1) chapter++
        else break
      }
      if (chapter === endCh && v > endVs) break
      items.push({ chapter, verse: v, node: fragment(verses[i].html) })
      i++
    }
    return items
  })
}

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
    if (tag === 'td') { out += `${inner} `; continue }
    if (tag === 'tr') { out += `${inner.trim()}; `; continue }
    if (cls === 'red') out += `<span class="red">${inner}</span>`
    else if (cls === 'sc' || cls === 'subhead-sc') out += `<span class="sc">${inner}</span>`
    // KJV italics mark words the translators supplied.
    else if (cls === 'ital') out += `<em class="supplied">${inner}</em>`
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
      // Lists like Revelation 7:5–8 come as a table; render each row as a line.
      if (tag === 'table') {
        para = null
        let rowVerse = verse
        for (const tr of n.querySelectorAll('tr')) {
          const vn = tr.querySelector('.vn')
          if (vn) rowVerse = +vn.textContent
          const cells = [...tr.querySelectorAll('td')].map((td) => inline(td)).filter((c) => c.trim())
          if (!cells.length) continue
          const k = `${chapter}.${rowVerse}`
          const isFirst = !seen.has(k)
          seen.add(k)
          blocks.push({ type: 'line', chapter, verse: rowVerse, html: cells.map((c) => `<span class="cell">${c}</span>`).join(''), indent: 1, row: true, first: isFirst })
        }
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
  return verses
    .map(({ verse, node }) => {
      node.querySelectorAll('h1,h2,h3,h4,h5,.psa-title,.psa-hebrew,[class*=subhead]').forEach((e) => e.remove())
      return { verse, html: inline(node, { notes: false }).replace(/\s+/g, ' ').trim() }
    })
    .filter((v) => v.html)
}

// 1 Enoch isn't in the NLT; its chapters are prebuilt from R. H. Charles (scripts/build-enoch.mjs).
const LOCAL = new Set(['Enoch'])
const localCache = new Map()
function localChapter(book, chapter) {
  const key = `${book}.${chapter}`
  if (!localCache.has(key)) {
    const p = fetch(`/enoch/${chapter}.json`).then((r) => {
      if (!r.ok) throw new Error(`Chapter not found`)
      return r.json()
    })
    p.catch(() => localCache.delete(key))
    localCache.set(key, p)
  }
  return localCache.get(key)
}

// Verse texts for a ref from a local chapter, in the same shape as plainText().
async function localPassage(ref) {
  const blocks = await localChapter(ref.book, ref.chapter)
  const from = ref.verse ?? 1
  const to = ref.endChapter && ref.endChapter !== ref.chapter ? Infinity : ref.endVerse ?? ref.verse ?? Infinity
  const byVerse = new Map()
  for (const b of blocks) {
    for (const seg of b.type === 'para' ? b.segs : b.type === 'line' ? [b] : []) {
      if (seg.verse >= from && seg.verse <= to) byVerse.set(seg.verse, [...(byVerse.get(seg.verse) ?? []), seg.html])
    }
  }
  return [...byVerse].map(([verse, parts]) => ({ verse, html: parts.join(' ') }))
}

export async function getChapter(book, chapter, version = 'NLT') {
  if (LOCAL.has(book)) return localChapter(book, chapter)
  const html = await get(`/api/passages?version=${version}&ref=${toOsis({ book, chapter }, true)}`)
  const [verses] = html.includes('<verse_export') ? parseSections(html) : kjvAssign(kjvVerses(html), [{ book, chapter }])
  if (!verses?.length) throw new Error('Chapter not found')
  return toBlocks(verses)
}

/** Fetches many refs in one request. Returns Map<osis, [{verse, html}]>. */
export async function getPassages(refs, version = 'NLT') {
  const out = new Map()
  const all = refs.map((r) => (typeof r === 'string' ? parseOsis(r) : r))
  const list = all.filter((r) => !LOCAL.has(r.book))
  await Promise.all(all.filter((r) => LOCAL.has(r.book)).map(async (r) => out.set(toOsis(r), await localPassage(r).catch(() => []))))
  // Keep URLs a sane length.
  for (let i = 0; i < list.length; i += 40) {
    const chunk = list.slice(i, i + 40)
    const html = await get(`/api/passages?version=${version}&ref=${chunk.map((r) => toOsis(r, true)).join(';')}`)
    const sections = html.includes('<verse_export') ? parseSections(html) : kjvAssign(kjvVerses(html), chunk)
    chunk.forEach((r, j) => {
      if (sections[j]) out.set(toOsis(r), plainText(sections[j]))
    })
  }
  return out
}

/** Keyword search. Returns [{ ref, text }]. */
export async function search(text, version = 'NLT') {
  const doc = parser.parseFromString(await get(`/api/search?version=${version}&text=${encodeURIComponent(text)}`), 'text/html')
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

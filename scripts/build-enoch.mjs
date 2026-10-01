// Builds 1 Enoch from R. H. Charles's 1917 translation (public domain), as transcribed on
// Wikisource: https://en.wikisource.org/wiki/The_Book_of_Enoch_(Charles)
// Output: public/enoch/<chapter>.json, in the same block format the reader uses for the NLT.
//
// Changes from the source: Charles's critical sigla are removed for readability —
// ⌈ ⌉ and ⌈⌈ ⌉⌉ (words restored from other witnesses) and † (corrupt readings) — while the
// words themselves are kept. Square brackets (interpolations) and parentheses are kept.
import { mkdirSync, writeFileSync } from 'node:fs'

const OUT = new URL('../public/enoch/', import.meta.url)
const UA = 'Mantles/1.0 (https://github.com/lumpia-fiasco/swords)'
const CHAPTERS = 108

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Some chapters set the Ethiopic and Greek side by side in a table; keep the Ethiopic column.
function ethiopicColumn(wikitext) {
  return wikitext
    .split('\n')
    .flatMap((line) => {
      if (/^\s*(\{\||\|\}|\|-|!)/.test(line)) return []
      const row = line.match(/^\s*\|\s?(.*)$/)
      return row ? ['', row[1].split('||')[0].trim(), ''] : [line]
    })
    .join('\n')
}

function clean(wikitext) {
  return ethiopicColumn(wikitext)
    .replace(/\{\{header[\s\S]*?\n\}\}/, '')
    .replace(/<ref[^>]*\/>|<ref[^>]*>[\s\S]*?<\/ref>/g, '')
    .replace(/\{\{[^{}]*\}\}/g, '')
    .replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, '$1')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/[⌈⌉†〈〉]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
}

// Wiki italics → <em>, applied after escaping.
const inline = (s) => esc(s.trim()).replace(/'''(.+?)'''/g, '<strong>$1</strong>').replace(/''(.+?)''/g, '<em>$1</em>').replace(/\s+/g, ' ')

function toBlocks(text, chapter) {
  const blocks = []
  let verse = 0
  const seen = new Set()
  const first = (v) => (seen.has(v) ? false : (seen.add(v), true))
  // Split a run of text on verse numbers. Charles rearranges disordered passages and splits
  // some verses (6a, 7c), so accept any number near what we've seen rather than strict order.
  let maxSeen = 0
  const segments = (s) => {
    const out = []
    let last = 0
    let cur = verse || 1
    const used = new Set()
    for (const m of s.matchAll(/(^|\s)(\d{1,3})[a-e]?\.(?=\s)/g)) {
      const n = +m[2]
      // Nearby numbers are the running count; a larger unseen one is a verse Charles relocated.
      if (n < 1 || (n > maxSeen + 3 && (seen.has(n) || used.has(n) || n >= 80))) continue
      used.add(n)
      const before = s.slice(last, m.index + m[1].length)
      if (before.trim()) out.push({ verse: cur, text: before })
      cur = n
      if (n <= maxSeen + 3) verse = n
      maxSeen = Math.max(maxSeen, n <= maxSeen + 3 ? n : maxSeen)
      last = m.index + m[0].length + 1
    }
    const rest = s.slice(last)
    if (rest.trim()) out.push({ verse: cur, text: rest })
    return out
  }

  for (const para of text.split(/\n\s*\n/)) {
    const lines = []
    for (const raw of para.split('\n').map((l) => l.trim()).filter(Boolean)) {
      if (/^CHAPTER [IVXLC]+\.?$/i.test(raw)) continue
      const heading = raw.match(/^=+\s*(.*?)\s*=+$/)
      if (!heading) { lines.push(raw); continue }
      // Section titles like "Section I. Chapters I-XXXVI" or "I-V. Parable of Enoch…".
      if (heading[1] && !/^Introduction$/i.test(heading[1])) blocks.push({ type: 'heading', html: inline(heading[1]), kind: 'sub' })
    }
    if (!lines.length) continue
    // Broken short lines are poetry; long running text is prose.
    const poetic = lines.every((l) => l.length < 140) && (lines.length > 1 || lines[0].length < 110)
    if (poetic) {
      for (const l of lines) {
        for (const s of segments(l)) blocks.push({ type: 'line', chapter, verse: s.verse, html: inline(s.text), indent: 1, first: first(s.verse) })
      }
    } else {
      blocks.push({ type: 'para', segs: segments(lines.join(' ')).map((s) => ({ chapter, verse: s.verse, html: inline(s.text), first: first(s.verse) })) })
    }
  }
  return { blocks, verses: maxSeen }
}

// People/places in 1 Enoch that match STEPBible entries (see scripts/build-names.mjs), plus
// Enoch-only angels curated in src/enoch.js. Scanned per verse to build a names index.
const NAMES = {
  Enoch: ['H2585H'], Methuselah: ['H4968'], Noah: ['H5146'], Lamech: ['H3929H'], Jared: ['H3382G'],
  Adam: ['H0121G'], Seth: ['H8352'], Cain: ['H7014B'], Abel: ['H1893'], Eve: ['H2332'],
  Mahalalel: ['H4111G'], Michael: ['H4317Q'], Gabriel: ['H1403'], Azazel: ['H5799'], Elijah: ['H0452G'],
  Jerusalem: ['H3389'], Sinai: ['H5514G'], Lebanon: ['H3844G'], Raphael: ['ang:raphael'], Uriel: ['ang:uriel'],
}
const plain = (html) => html.replace(/<[^>]+>/g, '')
function namesIndex(blocks) {
  const n = {}
  const v = {}
  for (const b of blocks) {
    for (const seg of b.type === 'para' ? b.segs : b.type === 'line' ? [b] : []) {
      for (const [name, ids] of Object.entries(NAMES)) {
        if (!new RegExp(`\\b${name}\\b`).test(plain(seg.html))) continue
        for (const id of ids) {
          ;(n[id] ??= []).includes(name) || n[id].push(name)
          ;(v[seg.verse] ??= []).includes(id) || v[seg.verse].push(id)
        }
      }
    }
  }
  return { n, v }
}
const names = {}

mkdirSync(OUT, { recursive: true })
let total = 0
const counts = []
for (let ch = 1; ch <= CHAPTERS; ch++) {
  const title = `The_Book_of_Enoch_(Charles)/Chapter_${String(ch).padStart(2, '0')}`
  const res = await fetch(`https://en.wikisource.org/w/index.php?title=${encodeURIComponent(title)}&action=raw`, { headers: { 'User-Agent': UA } })
  if (!res.ok) throw new Error(`Chapter ${ch}: HTTP ${res.status}`)
  const { blocks, verses } = toBlocks(clean(await res.text()), ch)
  if (!verses) console.warn(`Chapter ${ch}: no verse numbers found`)
  counts.push(verses)
  total += verses
  writeFileSync(new URL(`${ch}.json`, OUT), JSON.stringify(blocks))
  names[ch] = namesIndex(blocks)
  await new Promise((r) => setTimeout(r, 150)) // be polite to Wikisource
}
console.log(`Wrote ${CHAPTERS} chapters, ${total} verses`)
writeFileSync(new URL('verses.json', OUT), JSON.stringify(counts))
writeFileSync(new URL('names.json', OUT), JSON.stringify(names))

// Proper-name data (STEPBible TIPNR, built by scripts/build-names.mjs) plus the curated divine names.
import { DIVINE, DIVINE_WORDS } from './divine.js'
import { ENOCH_ENTRIES } from './enoch.js'

const idxCache = new Map()
const entCache = new Map()

function json(url) {
  return fetch(url).then((r) => (r.ok ? r.json() : {})).catch(() => ({}))
}

function bookIndex(book) {
  if (!idxCache.has(book)) {
    const p = json(book === 'Enoch' ? '/enoch/names.json' : `/names/idx/${book}.json`)
    p.catch(() => idxCache.delete(book))
    idxCache.set(book, p)
  }
  return idxCache.get(book)
}

/** Map<verse, [{ id, names }]> of the people and places in a chapter. */
export async function chapterNames(book, chapter) {
  const ch = (await bookIndex(book))[chapter]
  const out = new Map()
  if (!ch) return out
  for (const [vs, ids] of Object.entries(ch.v)) out.set(+vs, ids.map((id) => ({ id, names: ch.n[id] ?? [] })))
  return out
}

export async function getEntry(id) {
  if (DIVINE[id]) return { id, kind: 'DIVINE', ...DIVINE[id] }
  if (ENOCH_ENTRIES[id]) return { id, kind: 'OTHER', ...ENOCH_ENTRIES[id] }
  const bucket = id.slice(0, 3)
  if (!entCache.has(bucket)) {
    const p = json(`/names/ent/${bucket}.json`)
    p.catch(() => entCache.delete(bucket))
    entCache.set(bucket, p)
  }
  const e = (await entCache.get(bucket))[id]
  return e ? { id, ...e } : null
}

const reEsc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const attrEsc = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
const DIVINE_SET = new Set(DIVINE_WORDS.map(([w]) => w))
const SC_LORD = /<span class="sc">Lord<\/span>/g
const TOKEN = ''

const tag = (ids, inner) => `<span class="nm" role="button" tabindex="0" data-nm="${attrEsc(ids.join(','))}">${inner}</span>`

/**
 * Wraps the names in a verse's HTML with clickable spans. Only text between tags is touched,
 * so markup and footnote attributes are left alone.
 */
export function linkNames(html, people = []) {
  // name → ids (a name can belong to two entries in one verse, e.g. Israel the man and the nation)
  const byName = new Map()
  for (const { id, names } of people) {
    for (const n of names) {
      if (DIVINE_SET.has(n) || n.length < 2) continue
      byName.set(n, [...(byName.get(n) ?? []), id])
    }
  }
  for (const [w, id] of DIVINE_WORDS) if (!byName.has(w)) byName.set(w, [id])

  // NLT prints the divine name as small-caps “Lord”; link it before plain-text matching.
  html = html.replace(SC_LORD, TOKEN)
  const words = [...byName.keys()].sort((a, b) => b.length - a.length).map(reEsc)
  const re = new RegExp(`(?<![\\p{L}’'-])(${words.join('|')})(?![\\p{L}-])`, 'gu')
  html = html
    .split(/(<[^>]+>)/)
    .map((part) => (part.startsWith('<') ? part : part.replace(re, (m) => tag(byName.get(m), m))))
    .join('')
  return html.replaceAll(TOKEN, tag(['div:yhwh'], '<span class="sc">Lord</span>'))
}

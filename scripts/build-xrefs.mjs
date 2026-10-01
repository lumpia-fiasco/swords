// Builds per-book cross-reference files from the OpenBible.info dataset
// (CC-BY, https://www.openbible.info/labs/cross-references/).
// Output: public/xref/<Book>.json  →  { "<ch>.<vs>": [["John.3.16", votes], ...] }
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'

const MIN_VOTES = 3
const MAX_PER_VERSE = 30

const src = readFileSync(new URL('../data/cross_references.txt', import.meta.url), 'utf8')
const byBook = {}

// "Prov.8.22-Prov.8.30" → "Prov.8.22-30"; cross-chapter ranges keep their end chapter.
function compact(to) {
  const [a, b] = to.split('-')
  if (!b) return a
  const [bk, ch] = a.split('.')
  const [bk2, ch2, vs2] = b.split('.')
  if (bk !== bk2) return a
  return ch === ch2 ? `${a}-${vs2}` : `${a}-${ch2}.${vs2}`
}

for (const line of src.split('\n').slice(1)) {
  const [from, to, votesStr] = line.split('\t')
  if (!to) continue
  const votes = Number(votesStr)
  if (votes < MIN_VOTES) continue
  const [bk, ch, vs] = from.split('.')
  ;((byBook[bk] ??= {})[`${ch}.${vs}`] ??= []).push([compact(to), votes])
}

mkdirSync(new URL('../public/xref/', import.meta.url), { recursive: true })
let total = 0
for (const [bk, verses] of Object.entries(byBook)) {
  for (const k in verses) {
    verses[k] = verses[k].sort((a, b) => b[1] - a[1]).slice(0, MAX_PER_VERSE)
    total += verses[k].length
  }
  writeFileSync(new URL(`../public/xref/${bk}.json`, import.meta.url), JSON.stringify(verses))
}
console.log(`Wrote ${Object.keys(byBook).length} books, ${total} cross-references`)

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

// 1 Enoch isn't in the OpenBible data. Link it to the passages that quote or echo it,
// in both directions.
const ENOCH_LINKS = [
  ['Enoch.1.9', 'Jude.1.14-15'],
  ['Enoch.1.1', 'Gen.5.21-24'],
  ['Enoch.6.1-2', 'Gen.6.1-4'],
  ['Enoch.10.4-6', 'Jude.1.6'],
  ['Enoch.10.4-6', '2Pet.2.4'],
  ['Enoch.10.12-13', 'Jude.1.6'],
  ['Enoch.10.12-13', '2Pet.2.4'],
  ['Enoch.46.1-2', 'Dan.7.9-13'],
  ['Enoch.70.1-2', 'Gen.5.24'],
  ['Enoch.70.1-2', 'Heb.11.5'],
]
for (const [a, b] of ENOCH_LINKS) {
  for (const [from, to] of [[a, b], [b, a]]) {
    const [bk, ch, vsRange] = from.split('.')
    const first = +vsRange.split('-')[0]
    const list = ((byBook[bk] ??= {})[`${ch}.${first}`] ??= [])
    // Rank just above the strongest existing link so the strength bars stay meaningful.
    if (!list.some(([r]) => r === to)) list.push([to, Math.max(10, ...list.map(([, v]) => v)) + 1])
  }
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

// Checks that every reference in src/patterns.js returns text from the NLT API.
// Usage: npm run dev (in another terminal), then: node scripts/check-patterns.mjs [base-url]
import { PATTERNS } from '../src/patterns.js'
import { parseOsis, toOsis } from '../src/ref.js'

const base = process.argv[2] ?? 'http://localhost:5173'
const refs = [...new Set(PATTERNS.flatMap((p) => p.rows.flatMap((r) => [...r.a, ...r.b])))].filter((r) => !r.startsWith('Enoch.'))
const bad = []
for (let i = 0; i < refs.length; i += 40) {
  const chunk = refs.slice(i, i + 40)
  const html = await (await fetch(`${base}/nlt/api/passages?version=NLT&ref=${chunk.map((r) => toOsis(parseOsis(r), true)).join(';')}`)).text()
  const sections = [...html.matchAll(/<section>([\s\S]*?)<\/section>/g)]
  chunk.forEach((r, j) => (!sections[j] || !/verse_export/.test(sections[j][1])) && bad.push(r))
}
console.log(`${PATTERNS.length} patterns, ${PATTERNS.reduce((n, p) => n + p.rows.length, 0)} rows, ${refs.length} unique refs`)
console.log(bad.length ? `Missing: ${bad.join(', ')}` : 'All references found.')
process.exitCode = bad.length ? 1 : 0

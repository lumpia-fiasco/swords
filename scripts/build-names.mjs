// Builds the names data from STEPBible (Tyndale House Cambridge, CC BY 4.0):
//   TIPNR  – every person/place, its Hebrew/Greek forms, and every verse it occurs in
//   TBESH  – Hebrew lexicon, which records the meaning of each proper name
//   TBESG  – Greek lexicon (forms + transliteration)
// STEPBible asks that the raw files not be redistributed, so they're downloaded into
// data/ (git-ignored) and only the derived app data is written to public/names/.
//
// Output:
//   public/names/idx/<Book>.json   { "<ch>": { n: { id: [english names] }, v: { "<vs>": [ids] } } }
//   public/names/ent/<bucket>.json { id: entry }   bucket = first 3 chars of id
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'

const DATA = new URL('../data/', import.meta.url)
const OUT = new URL('../public/names/', import.meta.url)
const SRC = 'https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/'
const FILES = {
  'tipnr.txt': 'Proper Nouns/TIPNR - Translators Individualised Proper Names with all References - STEPBible.org CC BY.txt',
  'tbesh.txt': 'Lexicons/TBESH - Translators Brief lexicon of Extended Strongs for Hebrew - STEPBible.org CC BY.txt',
  'tbesg.txt': 'Lexicons/TBESG - Translators Brief lexicon of Extended Strongs for Greek - STEPBible.org CC BY.txt',
}

async function load(name) {
  const file = new URL(name, DATA)
  if (!existsSync(file)) {
    console.log(`Downloading ${name}…`)
    const res = await fetch(SRC + encodeURI(FILES[name]))
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
    writeFileSync(file, await res.text())
  }
  return readFileSync(file, 'utf8').replace(/\r/g, '')
}

// STEPBible book codes → the app's book ids.
const BOOK = {
  Gen: 'Gen', Exo: 'Exod', Lev: 'Lev', Num: 'Num', Deu: 'Deut', Jos: 'Josh', Jdg: 'Judg', Rut: 'Ruth',
  '1Sa': '1Sam', '2Sa': '2Sam', '1Ki': '1Kgs', '2Ki': '2Kgs', '1Ch': '1Chr', '2Ch': '2Chr', Ezr: 'Ezra',
  Neh: 'Neh', Est: 'Esth', Job: 'Job', Psa: 'Ps', Pro: 'Prov', Ecc: 'Eccl', Sng: 'Song', Isa: 'Isa',
  Jer: 'Jer', Lam: 'Lam', Ezk: 'Ezek', Dan: 'Dan', Hos: 'Hos', Jol: 'Joel', Amo: 'Amos', Oba: 'Obad',
  Jon: 'Jonah', Mic: 'Mic', Nam: 'Nah', Hab: 'Hab', Zep: 'Zeph', Hag: 'Hag', Zec: 'Zech', Mal: 'Mal',
  Mat: 'Matt', Mrk: 'Mark', Luk: 'Luke', Jhn: 'John', Act: 'Acts', Rom: 'Rom', '1Co': '1Cor', '2Co': '2Cor',
  Gal: 'Gal', Eph: 'Eph', Php: 'Phil', Col: 'Col', '1Th': '1Thess', '2Th': '2Thess', '1Ti': '1Tim',
  '2Ti': '2Tim', Tit: 'Titus', Phm: 'Phlm', Heb: 'Heb', Jas: 'Jas', '1Pe': '1Pet', '2Pe': '2Pet',
  '1Jn': '1John', '2Jn': '2John', '3Jn': '3John', Jud: 'Jude', Rev: 'Rev',
}

// Handled by src/divine.js instead (their TIPNR refs are "etc", not exhaustive).
const SKIP_IDS = new Set(['H3068G', 'G2424G'])

// NT people whose Greek names render a Hebrew one; TBESG doesn't link these back.
const HEBREW_OF = {
  John: 'H3110', James: 'H3290', Mary: 'H4813', Simon: 'H8095', Simeon: 'H8095', Joseph: 'H3130',
  Judas: 'H3063', Jude: 'H3063', Zechariah: 'H2148', Elizabeth: 'H0472', Matthew: 'H4993',
  Lazarus: 'H0499', Saul: 'H7586', Anna: 'H2584', Joanna: 'H3110', Jonah: 'H3124', Levi: 'H3878',
  Matthias: 'H4993', Eliakim: 'H0471', Joses: 'H3130',
}
// Meanings for NT names not drawn from Hebrew (sources noted where Scripture itself gives them).
const GREEK_MEANING = {
  Peter: '“rock” (Greek; John 1:42)', Cephas: '“rock” (Aramaic; John 1:42)', Paul: '“small” (Latin Paulus)',
  Barnabas: '“son of encouragement” (Acts 4:36)', Thomas: '“twin” (Aramaic; John 11:16)',
  Tabitha: '“gazelle” (Aramaic; Acts 9:36)', Dorcas: '“gazelle” (Greek; Acts 9:36)',
  Martha: '“lady, mistress” (Aramaic)', Bartholomew: '“son of Talmai” (Aramaic)',
  Timothy: '“honoring God”', Stephen: '“crown”', Philip: '“lover of horses”', Andrew: '“manly”',
  Nicodemus: '“victory of the people”', Theophilus: '“friend of God”', Timotheus: '“honoring God”',
  Silas: 'short form of Silvanus, “of the forest” (Latin)', Priscilla: '“little old woman” (Latin)',
  Lydia: '“from Lydia”', Rhoda: '“rose”', Phoebe: '“bright, radiant”', Eutychus: '“fortunate”',
}

// Place meanings the STEPBible lexicon doesn't record (it has none for Greek place names, and
// skips some Hebrew ones). Only well-attested etymologies; uncertain ones say so. Places whose
// meaning is genuinely unknown (Ephesus, Corinth, Patmos…) are left out on purpose.
const PLACE_MEANING = {
  Jordan: '“the descender” (from yarad, “to go down”)',
  Hebron: '“alliance, association” (from chavar, “to join”)',
  Shiloh: 'probably “tranquility, place of rest”',
  Sodom: 'uncertain; often explained as “burning”',
  Gomorrah: 'uncertain; often explained as “submersion”',
  Negeb: '“dry, parched land,” and so “the south”',
  Nazareth: 'probably from netser, “branch, shoot” (compare Isaiah 11:1; Matthew 2:23)',
  Capernaum: '“village of Nahum” (Nahum means “comfort”)',
  Bethany: 'uncertain; perhaps “house of figs” or “house of the afflicted”',
  Bethsaida: '“house of fishing” (Aramaic)',
  Gethsemane: '“oil press” (Aramaic)',
  Golgotha: '“the Place of the Skull” (John 19:17)',
  'Red Sea': 'in Hebrew Yam Suph, “Sea of Reeds”',
  'Salt Sea': '“Sea of Salt,” today the Dead Sea',
  'Olives Mount': '“mountain of olive trees”',
  Macedonia: 'named for the Makedones people; often explained as “highlanders”',
  Antioch: '“city of Antiochus,” named for the Seleucid king',
  Caesarea: '“city of Caesar,” named for Caesar Augustus',
  Athens: '“city of Athena,” named for the Greek goddess',
  Thessalonica: 'named for Thessalonike, “victory over Thessaly”',
  Philippi: '“city of Philip,” named for Philip II of Macedon (Philip means “lover of horses”)',
  Galatia: '“land of the Gauls”',
  Laodicea: 'named for Laodice; the name means “justice of the people”',
  Philadelphia: '“brotherly love”',
  Smyrna: '“myrrh”',
  Pergamum: '“citadel, height”',
  Magadan: 'probably Magdala, “tower” (Aramaic migdal)',
  Joppa: '“beautiful” (Hebrew Yafo)',
  Megiddo: 'uncertain; Har-Megiddo, “mountain of Megiddo,” is Armageddon (Revelation 16:16)',
  Engedi: '“spring of the young goat”',
  Sharon: '“plain, level land”',
  Arabah: '“desert plain, steppe”',
  Shephelah: '“lowland, foothills”',
  Susa: '“lily” (Hebrew Shushan)',
  Debir: '“inner sanctuary”; also called Kiriath-sepher, “city of books”',
  Haran: '“road, crossroads” (a caravan route)',
  Bethphage: '“house of unripe figs”',
  Emmaus: 'probably “warm springs”',
  Bethesda: 'probably “house of mercy” (Aramaic)',
  Akeldama: '“Field of Blood” (Acts 1:19)',
  Gabbatha: 'Aramaic for a raised place; John calls it “the Stone Pavement” (John 19:13)',
  Nain: 'probably “pleasant”',
  Pamphylia: '“of every tribe”',
  Troas: '“the Troad,” the region of ancient Troy',
}

// ---------- Lexicons ----------
function parseLexicon(text) {
  const byD = new Map() // dStrong → entry
  const byE = new Map() // eStrong → first entry with a meaning
  for (const line of text.split('\n')) {
    if (!/^[HG]\d/.test(line)) continue
    const c = line.split('\t')
    const d = c[1].split(' ')[0]
    const meaning = c[7]?.match(/§ [^=<]+=\s*([^<]+)/)?.[1]?.trim().replace(/"([^"]*)"/g, '“$1”')
    const entry = { orig: c[3], translit: c[4], gloss: c[6], meaning, greekOf: c[1].includes('the Greek of') ? c[2].trim() : null }
    byD.set(d, entry)
    if (meaning && !byE.has(c[0])) byE.set(c[0], entry)
  }
  return { byD, byE }
}

// ---------- TIPNR ----------
function parseRefs(s) {
  const out = []
  for (const r of s.split(/;\s*/)) {
    const m = r.trim().match(/^(?:LXX\s*)?([1-3]?[A-Z][a-z]{1,2})\.(\d+)\.(\d+)/)
    if (m && BOOK[m[1]]) out.push([BOOK[m[1]], +m[2], +m[3]])
  }
  return out
}

const englishNames = (field) =>
  field
    .split(';')
    .filter((p) => !/=\s*(KJV|LK|LQ)\s*$/.test(p) || !p.includes('='))
    .map((p) => p.split('=')[0].replace(/[/–]/g, ' ').replace(/\s+/g, ' ').trim())
    .flatMap((p) => p.split(',').map((x) => x.trim()))
    .filter((p) => p && /^[A-Z]/.test(p) && !p.startsWith('['))

function parseTipnr(text) {
  const records = text.split(/\n(?=\$=+ ?(?:PERSON|PLACE|OTHER))/).slice(1)
  const entities = []
  for (const rec of records) {
    const lines = rec.split('\n')
    const kind = lines[0].match(/(PERSON|PLACE|OTHER)/)[1]
    if (lines[0].includes('EXCLUDED')) continue
    const head = lines[1]?.split('\t')
    if (!head || !head[0].includes('=')) continue
    const [unique, id] = head[0].split('=')
    const name = unique.split('@')[0].replace(/_/g, ' ')
    const firstRef = unique.split('@')[1]?.split('-')[0]
    const type = head.filter(Boolean).at(-1)?.trim()
    const text = (tag) => rec.match(new RegExp(`@${tag}=\\s*([^\\t\\n@]*)`))?.[1]?.trim() || null
    const e = {
      id, unique, kind, name, type: type === '>' ? null : type,
      desc: kind === 'PERSON' ? head[1]?.trim() : null,
      parents: kind === 'PERSON' ? head[2] : '', siblings: kind === 'PERSON' ? head[3] : '',
      partners: kind === 'PERSON' ? head[4] : '', offspring: kind === 'PERSON' ? head[5] : '',
      brief: text('Brief'), short: text('Short'), firstRef,
      forms: [],
    }
    for (const l of lines) {
      if (!l.startsWith('– ') || l.startsWith('– Total')) continue
      const c = l.split('\t')
      const sig = c[0].slice(2).trim()
      if (/^\(same/.test(sig) || sig === 'Mentioned' || !c[2]) continue
      // "H0085«H0085=אַבְרָהָם" or combined "H5251G«H5251=נֵס+H3068G«H3068=יהוה"
      const parts = c[2].split('+').map((p) => {
        const [strongs, orig] = p.split('=')
        const [d, eS] = strongs.split('«')
        return { d, e: eS, orig }
      })
      // Refs are in the first column after the English names that looks like "Gen.1.1; …".
      const refs = c.slice(4).find((x) => /^\s*(?:LXX\s*)?[1-3]?[A-Z][a-z]{1,2}\.\d+\.\d+/.test(x)) ?? ''
      e.forms.push({ sig, parts, english: englishNames(c[3] ?? ''), refs: parseRefs(refs) })
    }
    if (e.forms.length) entities.push(e)
  }
  return entities
}

// ---------- Build ----------
const [tipnr, tbesh, tbesg] = await Promise.all(['tipnr.txt', 'tbesh.txt', 'tbesg.txt'].map(load))
const heb = parseLexicon(tbesh)
const grk = parseLexicon(tbesg)
const entities = parseTipnr(tipnr).filter((e) => !SKIP_IDS.has(e.id))
const idByUnique = new Map(entities.map((e) => [e.unique.replace(/\(.\)$/, ''), e.id]))

function hebMeaning(d, eStrong) {
  const base = eStrong?.replace(/[a-z]$/, '')
  return heb.byD.get(d)?.meaning ?? heb.byE.get(eStrong?.toUpperCase())?.meaning ?? heb.byE.get(base)?.meaning ?? null
}

const linkList = (s) =>
  (s ?? '')
    .split(/,\s*|\s\+\s*/)
    .map((x) => x.trim().replace(/\((?:a|d|f|\?)\)$/, ''))
    .filter((x) => x && x.includes('@'))
    .map((u) => ({ name: u.split('@')[0].split('|').at(-1).replace(/_/g, ' '), id: idByUnique.get(u) ?? null }))

const index = {} // book → ch → { n: {id: Set(names)}, v: {vs: Set(ids)} }
const buckets = {}
let withMeaning = 0

for (const e of entities) {
  const forms = []
  const seenForm = new Set()
  for (const f of e.forms) {
    // Original-language forms (combined names keep each part).
    for (const p of f.parts) {
      const isHeb = p.d.startsWith('H')
      const lex = (isHeb ? heb : grk).byD.get(p.d) ?? (isHeb ? heb : grk).byD.get(p.e?.toUpperCase())
      const key = p.orig
      if (!key || seenForm.has(key)) continue
      seenForm.add(key)
      forms.push({
        orig: p.orig,
        lang: f.sig.startsWith('Aramaic') ? 'Aramaic' : isHeb ? 'Hebrew' : 'Greek',
        translit: lex?.translit?.replace(/\./g, '·') ?? null,
        strong: p.d,
        meaning: isHeb ? hebMeaning(p.d, p.e) : null,
        english: f.english[0] ?? e.name,
      })
    }
    // Verse index.
    const names = new Set([...f.english, e.name])
    for (const [bk, ch, vs] of f.refs) {
      const c = ((index[bk] ??= {})[ch] ??= { n: {}, v: {} })
      for (const n of names) (c.n[e.id] ??= new Set()).add(n)
      ;(c.v[vs] ??= new Set()).add(e.id)
    }
  }

  // Greek-only names: find the Hebrew name behind them.
  let hebrew = null
  if (!forms.some((f) => f.lang !== 'Greek')) {
    const g = forms[0]
    const viaLex = grk.byD.get(g?.strong)?.greekOf
    const hStrong = viaLex?.startsWith('H') ? viaLex : HEBREW_OF[e.name]
    const h = hStrong && (heb.byD.get(hStrong) ?? heb.byD.get(hStrong + 'G') ?? heb.byE.get(hStrong))
    if (h) hebrew = { orig: h.orig, translit: h.translit?.replace(/\./g, '·'), strong: hStrong, meaning: hebMeaning(hStrong, hStrong) }
  }
  let meaning = forms.find((f) => f.meaning)?.meaning ?? hebrew?.meaning ?? GREEK_MEANING[e.name] ?? null
  // Curated fill-ins are flagged so the panel can say they aren't from the lexicon.
  let curated = false
  if (!meaning && (e.kind === 'PLACE' || e.kind === 'PLACE+PERSON') && PLACE_MEANING[e.name]) {
    meaning = PLACE_MEANING[e.name]
    curated = true
  }
  if (meaning) withMeaning++

  const entry = {
    name: e.name, kind: e.kind, type: e.type, desc: e.desc, brief: e.brief, short: e.short,
    firstRef: e.firstRef, meaning, forms, hebrew,
    ...(curated && { curated: true }),
  }
  if (e.kind === 'PERSON') {
    for (const k of ['parents', 'siblings', 'partners', 'offspring']) {
      const l = linkList(e[k])
      if (l.length) entry[k] = l
    }
  }
  ;(buckets[e.id.slice(0, 3)] ??= {})[e.id] = entry
}

rmSync(OUT, { recursive: true, force: true })
mkdirSync(new URL('idx/', OUT), { recursive: true })
mkdirSync(new URL('ent/', OUT), { recursive: true })
for (const [bk, chapters] of Object.entries(index)) {
  const out = {}
  for (const [ch, { n, v }] of Object.entries(chapters)) {
    out[ch] = {
      n: Object.fromEntries(Object.entries(n).map(([id, s]) => [id, [...s]])),
      v: Object.fromEntries(Object.entries(v).map(([vs, s]) => [vs, [...s]])),
    }
  }
  writeFileSync(new URL(`idx/${bk}.json`, OUT), JSON.stringify(out))
}
for (const [b, entries] of Object.entries(buckets)) writeFileSync(new URL(`ent/${b}.json`, OUT), JSON.stringify(entries))
console.log(`${entities.length} names (${withMeaning} with meanings), ${Object.keys(index).length} books, ${Object.keys(buckets).length} entry files`)

// id = OSIS-style code used internally and by the cross-reference data.
// api = code the NLT API accepts (only differs for a few books).
export const BOOKS = [
  ['Gen', 'Genesis', 50], ['Exod', 'Exodus', 40], ['Lev', 'Leviticus', 27],
  ['Num', 'Numbers', 36], ['Deut', 'Deuteronomy', 34], ['Josh', 'Joshua', 24],
  ['Judg', 'Judges', 21], ['Ruth', 'Ruth', 4], ['1Sam', '1 Samuel', 31],
  ['2Sam', '2 Samuel', 24], ['1Kgs', '1 Kings', 22], ['2Kgs', '2 Kings', 25],
  ['1Chr', '1 Chronicles', 29], ['2Chr', '2 Chronicles', 36], ['Ezra', 'Ezra', 10],
  ['Neh', 'Nehemiah', 13], ['Esth', 'Esther', 10], ['Job', 'Job', 42],
  ['Ps', 'Psalms', 150], ['Prov', 'Proverbs', 31], ['Eccl', 'Ecclesiastes', 12],
  ['Song', 'Song of Songs', 8], ['Isa', 'Isaiah', 66], ['Jer', 'Jeremiah', 52],
  ['Lam', 'Lamentations', 5], ['Ezek', 'Ezekiel', 48], ['Dan', 'Daniel', 12],
  ['Hos', 'Hosea', 14], ['Joel', 'Joel', 3], ['Amos', 'Amos', 9],
  ['Obad', 'Obadiah', 1], ['Jonah', 'Jonah', 4], ['Mic', 'Micah', 7],
  ['Nah', 'Nahum', 3], ['Hab', 'Habakkuk', 3], ['Zeph', 'Zephaniah', 3],
  ['Hag', 'Haggai', 2], ['Zech', 'Zechariah', 14], ['Mal', 'Malachi', 4],
  ['Matt', 'Matthew', 28], ['Mark', 'Mark', 16], ['Luke', 'Luke', 24],
  ['John', 'John', 21], ['Acts', 'Acts', 28], ['Rom', 'Romans', 16],
  ['1Cor', '1 Corinthians', 16], ['2Cor', '2 Corinthians', 13], ['Gal', 'Galatians', 6],
  ['Eph', 'Ephesians', 6], ['Phil', 'Philippians', 4], ['Col', 'Colossians', 4],
  ['1Thess', '1 Thessalonians', 5], ['2Thess', '2 Thessalonians', 3], ['1Tim', '1 Timothy', 6],
  ['2Tim', '2 Timothy', 4], ['Titus', 'Titus', 3], ['Phlm', 'Philemon', 1],
  ['Heb', 'Hebrews', 13], ['Jas', 'James', 5], ['1Pet', '1 Peter', 5],
  ['2Pet', '2 Peter', 3], ['1John', '1 John', 5], ['2John', '2 John', 1],
  ['3John', '3 John', 1], ['Jude', 'Jude', 1], ['Rev', 'Revelation', 22],
].map(([id, name, chapters], i) => ({ id, name, chapters, testament: i < 39 ? 'OT' : 'NT' }))

const API_CODES = { '1John': '1Jn', '2John': '2Jn', '3John': '3Jn', '1Thess': '1Th', '2Thess': '2Th' }
export const apiCode = (id) => API_CODES[id] ?? id

export const bookById = Object.fromEntries(BOOKS.map((b) => [b.id, b]))

// Lookup table of names/abbreviations → book id, for parsing typed references.
const ALIASES = {
  Gen: ['gn', 'ge'], Exod: ['ex', 'exo'], Lev: ['lv', 'le'], Num: ['nm', 'nu'],
  Deut: ['dt', 'de'], Josh: ['jos', 'jsh'], Judg: ['jdg', 'jg', 'jdgs'], Ruth: ['rth', 'ru'],
  Ps: ['psa', 'psalm', 'pss', 'psm'], Prov: ['pr', 'prv', 'pro'], Eccl: ['ecc', 'ec', 'qoh'],
  Song: ['sos', 'so', 'song of solomon', 'canticles', 'sng'], Isa: ['is'], Jer: ['je', 'jr'],
  Lam: ['la'], Ezek: ['eze', 'ezk'], Dan: ['da', 'dn'], Hos: ['ho'], Joel: ['jl'],
  Amos: ['am'], Obad: ['ob', 'oba'], Jonah: ['jnh', 'jon'], Mic: ['mi'], Nah: ['na'],
  Hab: ['hb'], Zeph: ['zep', 'zp'], Hag: ['hg'], Zech: ['zec', 'zc'], Mal: ['ml'],
  Matt: ['mt', 'mat'], Mark: ['mk', 'mrk', 'mr'], Luke: ['lk', 'luk'], John: ['jn', 'jhn', 'joh'],
  Acts: ['ac', 'act'], Rom: ['ro', 'rm'], Gal: ['ga'], Eph: ['ephes'], Phil: ['php', 'pp'],
  Col: ['co'], Titus: ['tit'], Phlm: ['philem', 'phm'], Heb: ['he'], Jas: ['jm', 'jam'],
  Jude: ['jud', 'jd'], Rev: ['re', 'rv', 'revelations', 'apocalypse'],
}
const NUMBERED = {
  Sam: ['sam', 'samuel', 'sa', 'sm'], Kgs: ['kgs', 'kings', 'ki', 'kg', 'kin'],
  Chr: ['chr', 'chronicles', 'ch', 'chron'], Cor: ['cor', 'corinthians', 'co'],
  Thess: ['thess', 'thessalonians', 'th', 'thes'], Tim: ['tim', 'timothy', 'ti', 'tm'],
  Pet: ['pet', 'peter', 'pe', 'pt'], John: ['john', 'jn', 'jhn', 'jo'],
}

const lookup = new Map()
const norm = (s) => s.toLowerCase().replace(/[\s.]+/g, '')
for (const b of BOOKS) {
  lookup.set(norm(b.id), b.id)
  lookup.set(norm(b.name), b.id)
  for (const a of ALIASES[b.id] ?? []) lookup.set(norm(a), b.id)
}
for (const [stem, forms] of Object.entries(NUMBERED)) {
  for (const [n, roman] of [['1', 'i'], ['2', 'ii'], ['3', 'iii']]) {
    const id = n + stem
    if (!bookById[id]) continue
    for (const f of forms) for (const p of [n, roman, n === '1' ? 'first' : n === '2' ? 'second' : 'third'])
      lookup.set(norm(p + f), id)
  }
}

export function findBook(text) {
  return lookup.get(norm(text)) ?? null
}

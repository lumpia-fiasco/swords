import { bookById, findBook, apiCode } from './books.js'

// A ref is { book, chapter, verse?, endChapter?, endVerse? }.
// Canonical string form matches the cross-reference data: "John.3.16", "Ps.91.1-2", "Gen.1.1-2.3".

export function parseOsis(s) {
  const [start, end] = s.split('-')
  const [book, ch, vs] = start.split('.')
  const ref = { book, chapter: +ch }
  if (vs) ref.verse = +vs
  if (end) {
    const parts = end.split('.')
    if (parts.length === 1) ref.endVerse = +parts[0]
    else { ref.endChapter = +parts[0]; ref.endVerse = +parts[1] }
  }
  return ref
}

export function toOsis(ref, api = false) {
  const bk = api ? apiCode(ref.book) : ref.book
  let s = `${bk}.${ref.chapter}`
  if (ref.verse) s += `.${ref.verse}`
  if (ref.endVerse) s += ref.endChapter && ref.endChapter !== ref.chapter ? `-${ref.endChapter}.${ref.endVerse}` : `-${ref.endVerse}`
  return s
}

export function label(ref) {
  const name = bookById[ref.book]?.name ?? ref.book
  // Single-chapter books read better as "Jude 1:20" than "Jude 20", keep the chapter.
  let s = `${name} ${ref.chapter}`
  if (ref.verse) s += `:${ref.verse}`
  if (ref.endVerse) s += ref.endChapter && ref.endChapter !== ref.chapter ? `–${ref.endChapter}:${ref.endVerse}` : `–${ref.endVerse}`
  return s
}

// Parses what a person types: "John 3:16", "jn 3 16", "1 cor 13", "Ps 91:1-4", "Romans 8".
export function parseTyped(input) {
  const m = input.trim().match(/^((?:[123]|i{1,3}|first|second|third)?\s*[a-z][a-z.\s]*?)\s*(\d+)(?:\s*[:.\s]\s*(\d+)(?:\s*[-–]\s*(\d+))?)?$/i)
  if (!m) return null
  let book = findBook(m[1])
  if (!book) {
    // Allow unambiguous prefixes like "phile" or "lament".
    const q = m[1].toLowerCase().replace(/[\s.]+/g, '')
    const hits = Object.values(bookById).filter((b) => b.name.toLowerCase().replace(/\s+/g, '').startsWith(q))
    if (hits.length !== 1) return null
    book = hits[0].id
  }
  const b = bookById[book]
  let chapter = +m[2]
  let verse = m[3] ? +m[3] : undefined
  // "Jude 20" means verse 20 of the only chapter.
  if (b.chapters === 1 && !verse && chapter > 1) { verse = chapter; chapter = 1 }
  if (chapter < 1 || chapter > b.chapters) return null
  const ref = { book, chapter }
  if (verse) ref.verse = verse
  if (m[4] && +m[4] > verse) ref.endVerse = +m[4]
  return ref
}

export function sameChapter(a, b) {
  return a && b && a.book === b.book && a.chapter === b.chapter
}

export function containsVerse(ref, chapter, verse) {
  if (!ref.verse) return false
  const endCh = ref.endChapter ?? ref.chapter
  const endVs = ref.endVerse ?? ref.verse
  const after = chapter > ref.chapter || (chapter === ref.chapter && verse >= ref.verse)
  const before = chapter < endCh || (chapter === endCh && verse <= endVs)
  return after && before
}

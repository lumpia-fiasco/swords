// Cross-references from OpenBible.info (CC-BY), split per book by scripts/build-xrefs.mjs.
const cache = new Map()

function loadBook(book) {
  if (!cache.has(book)) {
    const p = fetch(`/xref/${book}.json`).then((r) => (r.ok ? r.json() : {}))
    p.catch(() => cache.delete(book))
    cache.set(book, p)
  }
  return cache.get(book)
}

/** Returns [{ ref: "Rom.8.28", votes }] ranked by community votes. */
export async function getCrossRefs(book, chapter, verse) {
  const data = await loadBook(book)
  return (data[`${chapter}.${verse}`] ?? []).map(([ref, votes]) => ({ ref, votes }))
}

/** Which verses in a chapter have cross-references (used to mark them in the reader). */
export async function versesWithRefs(book, chapter) {
  const data = await loadBook(book)
  const prefix = `${chapter}.`
  return new Set(Object.keys(data).filter((k) => k.startsWith(prefix)).map((k) => +k.slice(prefix.length)))
}

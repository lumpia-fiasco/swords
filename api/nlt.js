// Production stand-in for the dev-server proxy in vite.config.js.
// /nlt/api/passages?ref=... is rewritten (vercel.json) to /api/nlt?path=api/passages&ref=...
// and forwarded to the NLT API with the key attached server-side.
const ALLOWED = new Set(['api/passages', 'api/search'])

// The NLT API sometimes answers 200 with an empty body (e.g. when busy or rate-limiting).
// A passage response is only real if it contains verses; never cache one that doesn't.
const hasVerses = (body) => body.includes('<verse_export')

async function fetchUpstream(url) {
  const res = await fetch(url)
  return { ok: res.ok, status: res.status, body: await res.text() }
}

export default async function handler(req, res) {
  // cv is the app's cache-busting version tag; it isn't for the NLT API.
  const { path, cv, ...query } = req.query
  const target = Array.isArray(path) ? path.join('/') : path
  if (!ALLOWED.has(target)) return res.status(404).send('Not found')

  const params = new URLSearchParams(query)
  params.set('key', process.env.NLT_API_KEY || 'TEST')
  const url = `https://api.nlt.to/${target}?${params}`

  let up = await fetchUpstream(url)
  // One retry for an empty or failed passage response.
  if (target === 'api/passages' && (!up.ok || !hasVerses(up.body))) up = await fetchUpstream(url)

  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (target === 'api/passages') {
    if (up.ok && hasVerses(up.body)) {
      // Scripture doesn't change; let Vercel's CDN absorb repeat requests.
      res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400')
      return res.status(200).send(up.body)
    }
    res.setHeader('Cache-Control', 'no-store')
    return res.status(502).send('The NLT API returned no text for this passage. Please try again.')
  }

  // Search: an empty body legitimately means "no results", so pass it through, but only cache briefly.
  res.setHeader('Cache-Control', up.ok ? 'public, s-maxage=3600' : 'no-store')
  res.status(up.status).send(up.body)
}

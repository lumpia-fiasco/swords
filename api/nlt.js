// Production stand-in for the dev-server proxy in vite.config.js.
// /nlt/api/passages?ref=... is rewritten (vercel.json) to /api/nlt?path=api/passages&ref=...
// and forwarded to the NLT API with the key attached server-side.
const ALLOWED = new Set(['api/passages', 'api/search'])

export default async function handler(req, res) {
  const { path, ...query } = req.query
  const target = Array.isArray(path) ? path.join('/') : path
  if (!ALLOWED.has(target)) return res.status(404).send('Not found')

  const params = new URLSearchParams(query)
  params.set('key', process.env.NLT_API_KEY || 'TEST')
  const upstream = await fetch(`https://api.nlt.to/${target}?${params}`)
  const body = await upstream.text()

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // Scripture doesn't change; let Vercel's CDN absorb repeat requests.
  if (upstream.ok) res.setHeader('Cache-Control', 'public, s-maxage=604800, stale-while-revalidate=86400')
  res.status(upstream.status).send(body)
}

# Swords

A Spirit-filled NLT study Bible. Look up a verse, a topic, or any word. The left panel shows related Scripture, and every verse in it opens in its full chapter.

## Run it

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## How it works

- **Text:** the New Living Translation, from Tyndale's official API ([api.nlt.to](https://api.nlt.to)). The dev server proxies `/nlt/*` to the API and adds the key, so the key never reaches the browser. Without a key it uses the shared `TEST` key, which is fine for light use. For real use, get a free key and put it in `.env`:
  ```
  NLT_API_KEY=your-key
  ```
- **Cross-references:** about 208k links from [OpenBible.info](https://www.openbible.info/labs/cross-references/) (CC-BY), ranked by community votes. `npm run xrefs` rebuilds `public/xref/*.json` from `data/cross_references.txt`.
- **Topics:** a hand-curated, charismatic-leaning index in `src/topics.js`. It covers God's Promises (16 categories), the Holy Spirit, Baptism in the Spirit, Gifts, Tongues, Prophecy, Healing, Signs & Wonders, Authority, Deliverance, Worship, and more. To add or edit a topic, edit the refs; the verse text loads on its own.

## Deploying

The site is deployed on Vercel. The NLT API doesn't send CORS headers, so `vercel.json` rewrites `/nlt/*` to the `api/nlt.js` serverless function. That function forwards the request to the API with the key attached and caches the responses on Vercel's CDN. In the Vercel project settings, set `NLT_API_KEY` under Environment Variables. Without it the function falls back to the shared `TEST` key.

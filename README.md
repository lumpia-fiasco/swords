# Mantles

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
- **Names:** tap any person, place or name of God in the text to open a right-hand panel. It shows the original Hebrew (or Greek, with the Hebrew behind it), the transliteration, the meaning, a short description, family links and where the name first appears. People and places come from STEPBible's [TIPNR](https://github.com/STEPBible/STEPBible-Data) and Hebrew lexicon (Tyndale House Cambridge, CC BY 4.0). TIPNR lists every verse each individual appears in, so two people with the same name resolve correctly (John the Baptist vs. John son of Zebedee). `npm run names` downloads the source files into `data/` and rebuilds `public/names/`. STEPBible asks that their raw files not be redistributed, so those downloads are git-ignored. The names and titles of God (YHWH, Elohim, Adonai, El Shaddai, Yeshua, Mashiach, Ruach HaKodesh and others) are curated in `src/divine.js`.
- **1 Enoch:** listed under "Other writings" in the book picker, with a note that it's outside the Protestant and Catholic canon. It uses R. H. Charles's 1917 translation (public domain), transcribed on [Wikisource](https://en.wikisource.org/wiki/The_Book_of_Enoch_(Charles)). `npm run enoch` rebuilds `public/enoch/`. Charles's critical sigla (⌈ ⌉ †) are removed for readability. Where Charles prints Ethiopic and Greek side by side, the Ethiopic is kept. A few curated cross-references link it to the passages that quote or echo it (Jude 14–15, Genesis 5–6, 2 Peter 2:4, Daniel 7).
- **Topics:** a hand-curated, charismatic-leaning index in `src/topics.js`. It covers God's Promises (16 categories), the Holy Spirit, Baptism in the Spirit, Gifts, Tongues, Prophecy, Healing, Signs & Wonders, Authority, Deliverance, Worship, and more. To add or edit a topic, edit the refs; the verse text loads on its own.

## Deploying

The site is deployed on Vercel. The NLT API doesn't send CORS headers, so `vercel.json` rewrites `/nlt/*` to the `api/nlt.js` serverless function. That function forwards the request to the API with the key attached and caches the responses on Vercel's CDN. In the Vercel project settings, set `NLT_API_KEY` under Environment Variables. Without it the function falls back to the shared `TEST` key.

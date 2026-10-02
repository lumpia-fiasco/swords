// Numbers in the text: recognizing them, and what Scripture associates with them.
// Numbers in the Bible are first literal counts. The meanings below are patterns grounded in
// specific passages; where Scripture gives no clear pattern, the panel says so.

const UNITS = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const ORD_UNITS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth']
const ORD_TENS = ['', '', 'twentieth', 'thirtieth', 'fortieth', 'fiftieth', 'sixtieth', 'seventieth', 'eightieth', 'ninetieth']

const value = new Map()
UNITS.forEach((w, i) => i && value.set(w, i))
TENS.forEach((w, i) => w && value.set(w, i * 10))
ORD_UNITS.forEach((w, i) => i && value.set(w, i))
ORD_TENS.forEach((w, i) => w && value.set(w, i * 10))

// "one" and "first" are left out on their own ("no one", "one another", "at first" would link
// almost everywhere); "first day" is still linked.
const cardinal = [
  `(?:${TENS.filter(Boolean).join('|')})-(?:${UNITS.slice(1, 10).join('|')}|${ORD_UNITS.slice(1, 10).join('|')})`,
  ...TENS.filter(Boolean),
  ...UNITS.slice(2).sort((a, b) => b.length - a.length),
].join('|')
const ordinal = [...ORD_TENS.filter(Boolean), ...ORD_UNITS.slice(2).sort((a, b) => b.length - a.length)].join('|')
const PHRASE = new RegExp(
  `(?<![\\p{L}\\d,’'-])(?:` +
    `\\d{1,3}(?:,\\d{3})+|\\d+` + // 144,000 · 666
    `|first day` +
    `|(?:a|${cardinal}) (?:hundred|thousand)(?: (?:and )?(?:${cardinal}))?` + // three hundred · a thousand
    `|${cardinal}|${ordinal}` +
    `)(?![\\p{L}\\d-])`,
  'giu',
)

export function parseNumber(text) {
  const t = text.toLowerCase()
  if (/^[\d,]+$/.test(t)) return +t.replace(/,/g, '')
  if (t === 'first day') return 1
  let total = 0
  let cur = 0
  for (const w of t.split(/[\s-]+/)) {
    if (w === 'and') continue
    if (w === 'a') cur = 1
    else if (w === 'hundred') cur = (cur || 1) * 100
    else if (w === 'thousand') { total += (cur || 1) * 1000; cur = 0 }
    else cur += value.get(w) ?? 0
  }
  return total + cur || null
}

const attr = (s) => s.replace(/"/g, '&quot;')

/** Wraps numbers in a verse's HTML (text between tags only) with clickable spans. */
export function linkNumbers(html) {
  return html
    .split(/(<[^>]+>)/)
    .map((part) =>
      part.startsWith('<')
        ? part
        : part.replace(PHRASE, (m) => {
            const n = parseNumber(m)
            return n ? `<span class="nm num" role="button" tabindex="0" data-num="${n}" data-word="${attr(m)}">${m}</span>` : m
          }),
    )
    .join('')
}

const TRIAL = {
  meaning: 'A limited time of trial: three and a half years, half of seven',
  short: 'Daniel and Revelation measure the same span several ways: “a time, times, and half a time,” 42 months and 1,260 days. Half of a complete seven, it is usually read as a cut-short season of persecution in which God protects His people.',
  keyRefs: ['Dan.7.25', 'Dan.12.7', 'Rev.11.2-3', 'Rev.12.6', 'Rev.12.14', 'Rev.13.5'],
}

export const NUMBERS = {
  1: {
    hebrew: { orig: 'אֶחָד', translit: 'e·chad' },
    meaning: 'Unity and the oneness of God',
    short: 'The Shema confesses that “the LORD is one.” The same word describes husband and wife becoming one flesh, and Jesus prays that His people would be one as He and the Father are one.',
    keyRefs: ['Deut.6.4', 'Gen.2.24', 'John.10.30', 'John.17.21', 'Eph.4.4-6'],
  },
  2: {
    hebrew: { orig: 'שְׁנַיִם', translit: 'shna·yim' },
    meaning: 'Witness and agreement',
    short: 'Testimony was confirmed by two or three witnesses. Jesus sent His disciples out two by two, promised power where two agree, and Revelation has two witnesses.',
    keyRefs: ['Deut.19.15', 'Eccl.4.9-10', 'Matt.18.19-20', 'Mark.6.7', 'Rev.11.3'],
  },
  3: {
    hebrew: { orig: 'שָׁלֹשׁ', translit: 'sha·losh' },
    meaning: 'Divine fullness and resurrection',
    short: 'Father, Son and Spirit; “holy, holy, holy”; and above all the third day, on which Jesus rose, as Hosea and Jonah had foreshadowed. A triple-braided cord is not easily broken.',
    keyRefs: ['Matt.28.19', 'Isa.6.3', 'Hos.6.2', 'Matt.12.40', '1Cor.15.4', 'Eccl.4.12'],
  },
  4: {
    hebrew: { orig: 'אַרְבַּע', translit: 'ar·ba' },
    meaning: 'The whole earth: four corners, four winds',
    short: 'Scripture speaks of the four corners of the earth and the four winds of heaven. Eden’s river split into four, and Ezekiel and John saw four living creatures around God’s throne.',
    keyRefs: ['Gen.2.10', 'Isa.11.12', 'Ezek.37.9', 'Ezek.1.5', 'Rev.7.1'],
  },
  5: {
    hebrew: { orig: 'חָמֵשׁ', translit: 'cha·mesh' },
    meaning: 'Often linked with grace and provision (interpretive)',
    short: 'Five loaves fed the crowd, and David took five smooth stones. The Law has five books. Scripture never explains five directly; “grace” is a traditional reading rather than a stated meaning.',
    keyRefs: ['Matt.14.17-20', '1Sam.17.40'],
  },
  6: {
    hebrew: { orig: 'שֵׁשׁ', translit: 'shesh' },
    meaning: 'Humanity and human work',
    short: 'People were created on the sixth day, and six days were given for work before the Sabbath rest. It falls one short of seven, and Revelation calls 666 “the number of a man.”',
    keyRefs: ['Gen.1.27', 'Gen.1.31', 'Exod.20.9-10', 'Rev.13.18'],
  },
  7: {
    hebrew: { orig: 'שֶׁבַע', translit: 'she·va' },
    meaning: 'Completion, rest and covenant',
    short: 'God finished His work and rested on the seventh day. The Hebrew for seven is close to the word for swearing an oath. Seven runs through Scripture: Jericho circled seven times, Naaman washed seven times, forgiveness “seventy times seven,” and Revelation’s sevens.',
    keyRefs: ['Gen.2.2-3', 'Lev.25.4', 'Josh.6.15-16', '2Kgs.5.14', 'Matt.18.21-22', 'Rev.1.20'],
  },
  8: {
    hebrew: { orig: 'שְׁמֹנֶה', translit: 'shmo·neh' },
    meaning: 'New beginnings',
    short: 'Boys were circumcised on the eighth day, and eight people came through the flood into a new world. Jesus rose on the day after the Sabbath, the first day of a new week, which early Christians called the eighth day.',
    keyRefs: ['Gen.17.12', 'Lev.14.10', '1Pet.3.20', 'Luke.2.21', 'John.20.26'],
  },
  9: {
    hebrew: { orig: 'תֵּשַׁע', translit: 'te·sha' },
    meaning: 'Often linked with fruitfulness (interpretive)',
    short: 'The fruit of the Spirit has nine qualities, and Jesus died at three in the afternoon, the ninth hour. Scripture does not assign nine a meaning directly.',
    keyRefs: ['Gal.5.22-23', 'Mark.15.34'],
  },
  10: {
    hebrew: { orig: 'עֶשֶׂר', translit: 'e·ser' },
    meaning: 'A complete measure: law, testing and responsibility',
    short: 'Ten commandments, ten plagues and the tithe (a tenth). Daniel was tested for ten days, and Jesus told of ten bridesmaids and ten servants.',
    keyRefs: ['Exod.34.28', 'Lev.27.30', 'Dan.1.12', 'Matt.25.1', 'Rev.2.10'],
  },
  11: {
    meaning: 'No established biblical meaning',
    short: 'After Judas left, the apostles were eleven until Matthias was chosen, so some read eleven as incompleteness. Scripture itself gives the number no meaning.',
    keyRefs: ['Acts.1.26', 'Matt.28.16'],
    none: true,
  },
  12: {
    hebrew: { orig: 'שְׁנֵים עָשָׂר', translit: 'shneim a·sar' },
    meaning: 'God’s people and His government',
    short: 'Twelve tribes of Israel and twelve apostles. The New Jerusalem has twelve gates bearing the tribes’ names and twelve foundations bearing the apostles’ names, and the tree of life bears twelve crops.',
    keyRefs: ['Gen.49.28', 'Matt.10.1-2', 'Luke.22.30', 'Rev.12.1', 'Rev.21.12-14', 'Rev.22.2'],
  },
  24: {
    meaning: 'The whole people of God at worship (12 + 12)',
    short: 'Twenty-four elders surround the throne. They are often read as the twelve tribes and the twelve apostles together. David also organized the priests into twenty-four divisions for temple service.',
    keyRefs: ['Rev.4.4', 'Rev.4.10-11', '1Chr.24.18-19'],
  },
  30: {
    meaning: 'Readiness for service',
    short: 'Joseph stood before Pharaoh at thirty, David became king at thirty, priests began service at thirty, and Jesus began His ministry about thirty. Thirty pieces of silver was also the price of a slave and of Jesus’ betrayal.',
    keyRefs: ['Gen.41.46', '2Sam.5.4', 'Num.4.3', 'Luke.3.23', 'Zech.11.12', 'Matt.26.15'],
  },
  40: {
    hebrew: { orig: 'אַרְבָּעִים', translit: 'ar·ba·im' },
    meaning: 'Testing, trial and preparation',
    short: 'Forty days of rain, Moses forty days on the mountain, Israel forty years in the wilderness, Elijah forty days to Horeb, Nineveh given forty days, and Jesus forty days in the wilderness and forty days with His disciples after rising.',
    keyRefs: ['Gen.7.12', 'Exod.24.18', 'Num.14.33-34', '1Kgs.19.8', 'Jonah.3.4', 'Matt.4.2', 'Acts.1.3'],
  },
  42: TRIAL,
  50: {
    hebrew: { orig: 'חֲמִשִּׁים', translit: 'cha·mi·shim' },
    meaning: 'Jubilee and freedom; Pentecost',
    short: 'The fiftieth year was the Jubilee, when freedom was proclaimed. The Festival of Harvest came fifty days after Passover, the day the Spirit was poured out at Pentecost.',
    keyRefs: ['Lev.25.10-11', 'Lev.23.16', 'Acts.2.1-4'],
  },
  70: {
    hebrew: { orig: 'שִׁבְעִים', translit: 'shiv·im' },
    meaning: 'The nations; fullness of time and forgiveness',
    short: 'Seventy elders received the Spirit, the exile lasted seventy years, Daniel saw seventy sets of seven, and Jesus sent out seventy (or seventy-two) and taught forgiveness “seventy times seven.”',
    keyRefs: ['Exod.1.5', 'Num.11.16', 'Jer.25.11', 'Dan.9.24', 'Luke.10.1', 'Matt.18.22'],
  },
  100: {
    meaning: 'No settled symbolic meaning',
    short: 'Scripture uses a hundred mainly as a count or a full measure: Abraham was a hundred when Isaac was born, the shepherd had a hundred sheep, and good soil yielded a hundredfold.',
    keyRefs: ['Gen.21.5', 'Luke.15.4', 'Matt.13.8'],
    none: true,
  },
  120: {
    meaning: 'The limit of the flesh and the gathering for the Spirit (interpretive)',
    short: 'God set human life at 120 years, and Moses died at 120. When the temple was dedicated, 120 priests sounded trumpets and the glory filled the house; about 120 believers gathered before Pentecost.',
    keyRefs: ['Gen.6.3', 'Deut.34.7', '2Chr.5.12-14', 'Acts.1.15'],
  },
  153: {
    meaning: 'Counted by an eyewitness; its symbolism is debated',
    short: 'John records exactly 153 large fish, and the net did not tear. Church fathers saw a picture of all nations gathered into one church; Scripture itself gives no interpretation.',
    keyRefs: ['John.21.11', 'Matt.4.19'],
  },
  300: {
    meaning: 'God’s victory through the few',
    short: 'God cut Gideon’s army to three hundred so Israel would know the victory was His.',
    keyRefs: ['Judg.7.6-7', 'Judg.7.22'],
  },
  400: {
    meaning: 'A long season of waiting before deliverance',
    short: 'God told Abraham his descendants would be oppressed four hundred years before coming out with great wealth.',
    keyRefs: ['Gen.15.13-14', 'Acts.7.6-7'],
  },
  666: {
    meaning: '“The number of a man”: the beast’s counterfeit',
    short: 'Revelation calls 666 the number of the beast and “the number of a man,” and asks for wisdom to understand it. Six tripled falls short of seven. Many scholars read it as the letters of “Nero Caesar” in Hebrew; some early manuscripts read 616.',
    keyRefs: ['Rev.13.16-18', 'Rev.14.9-11'],
  },
  1000: {
    hebrew: { orig: 'אֶלֶף', translit: 'e·lef' },
    meaning: 'Vastness and God’s abundance; the thousand-year reign',
    short: 'God owns the cattle on a thousand hills and keeps covenant for a thousand generations; to Him a day is like a thousand years. Revelation describes a thousand-year reign, which Christians interpret in different ways.',
    keyRefs: ['Ps.50.10', 'Deut.7.9', 'Ps.90.4', '2Pet.3.8', 'Rev.20.4-6'],
  },
  1260: TRIAL,
  144000: {
    meaning: 'The complete, sealed people of God (12 × 12 × 1,000)',
    short: 'John hears that 144,000 from the tribes of Israel are sealed, then turns and sees a vast crowd no one could count from every nation. Some read the 144,000 as a literal remnant of Israel; many read the two scenes as one people described two ways. Either way, twelve squared times a thousand speaks of fullness: none of God’s people are missing.',
    keyRefs: ['Rev.7.4-8', 'Rev.7.9-10', 'Rev.14.1-5'],
  },
}

/** The entry for a number, or a plain statement that none is recorded. */
export function numberEntry(n) {
  const e = NUMBERS[n]
  if (e) return { value: n, ...e }
  return {
    value: n,
    none: true,
    meaning: 'No established biblical meaning',
    short: 'Scripture doesn’t attach a symbolic meaning to this number. Here it is most likely a simple count or measure.',
  }
}

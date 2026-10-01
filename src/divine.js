// Names and titles of God. These are linked wherever they appear (STEPBible's verse lists
// for them aren't exhaustive), and show the Hebrew first in the Old Testament, Greek in the New.

export const DIVINE = {
  'div:yhwh': {
    name: 'LORD',
    type: 'Divine name',
    meaning: '“I AM” — the self-existent, covenant-keeping God',
    short: 'The personal, covenant name of God revealed to Moses at the burning bush. Out of reverence it was not spoken aloud, and most English Bibles render it LORD in small capitals.',
    forms: [
      { orig: 'יהוה', lang: 'Hebrew', translit: 'Yahweh (YHWH)', strong: 'H3068', english: 'LORD' },
      { orig: 'κύριος', lang: 'Greek', translit: 'kyrios', strong: 'G2962', english: 'Lord', nt: true },
    ],
    keyRefs: ['Exod.3.14-15', 'Exod.6.2-3', 'Exod.34.6-7', 'Isa.42.8'],
  },
  'div:sabaoth': {
    name: 'Lord of Heaven’s Armies',
    type: 'Divine name',
    meaning: '“LORD of Hosts” — commander of the armies of heaven',
    short: 'Yahweh Tseva’ot, traditionally “the LORD of Hosts.” The NLT renders it “the LORD of Heaven’s Armies,” emphasizing His command over angelic and earthly forces.',
    forms: [{ orig: 'יהוה צְבָאוֹת', lang: 'Hebrew', translit: 'Yahweh Tseva·ot', strong: 'H6635', english: 'LORD of Heaven’s Armies' }],
    keyRefs: ['1Sam.17.45', 'Ps.24.10', 'Ps.46.7', 'Isa.6.3'],
  },
  'div:elohim': {
    name: 'God',
    type: 'Divine name',
    meaning: '“God, the Mighty One” — plural in form, expressing majesty and fullness',
    short: 'The most common Hebrew word for God, used from the first verse of Scripture. In the New Testament the Greek theos carries the same meaning.',
    forms: [
      { orig: 'אֱלֹהִים', lang: 'Hebrew', translit: 'e·lo·him', strong: 'H0430', english: 'God' },
      { orig: 'אֵל', lang: 'Hebrew', translit: 'el', strong: 'H0410', english: 'God' },
      { orig: 'θεός', lang: 'Greek', translit: 'theos', strong: 'G2316', english: 'God', nt: true },
    ],
    keyRefs: ['Gen.1.1', 'Deut.6.4', 'Ps.46.10', 'John.1.1'],
  },
  'div:adonai': {
    name: 'Lord',
    type: 'Divine title',
    meaning: '“My Lord, Master” — the One with rightful authority',
    short: 'Adonai is the Hebrew title of lordship. In the New Testament kyrios is used of God and, strikingly, of Jesus, applying God’s name to Him.',
    forms: [
      { orig: 'אֲדֹנָי', lang: 'Hebrew', translit: 'a·do·nai', strong: 'H0136', english: 'Lord' },
      { orig: 'κύριος', lang: 'Greek', translit: 'kyrios', strong: 'G2962', english: 'Lord', nt: true },
    ],
    keyRefs: ['Ps.8.1', 'Isa.6.1', 'Rom.10.9', 'Phil.2.11'],
  },
  'div:shaddai': {
    name: 'Almighty',
    type: 'Divine name',
    meaning: '“God Almighty, the All-Sufficient One”',
    short: 'El Shaddai, the name by which God revealed Himself to Abraham, Isaac and Jacob. Revelation’s pantokratōr, “ruler of all,” carries it into the New Testament.',
    forms: [
      { orig: 'אֵל שַׁדַּי', lang: 'Hebrew', translit: 'el shad·dai', strong: 'H7706', english: 'God Almighty' },
      { orig: 'παντοκράτωρ', lang: 'Greek', translit: 'pantokratōr', strong: 'G3841', english: 'Almighty', nt: true },
    ],
    keyRefs: ['Gen.17.1', 'Exod.6.3', 'Ps.91.1', 'Rev.4.8'],
  },
  'div:elyon': {
    name: 'Most High',
    type: 'Divine name',
    meaning: '“The Most High, the Exalted One” — sovereign over all',
    short: 'El Elyon, first heard from Melchizedek, proclaims God’s supremacy over every power and nation.',
    forms: [
      { orig: 'עֶלְיוֹן', lang: 'Hebrew', translit: 'el·yon', strong: 'H5945', english: 'Most High' },
      { orig: 'ὕψιστος', lang: 'Greek', translit: 'hypsistos', strong: 'G5310', english: 'Most High', nt: true },
    ],
    keyRefs: ['Gen.14.18-20', 'Ps.91.1', 'Dan.4.34', 'Luke.1.35'],
  },
  'div:yeshua': {
    name: 'Jesus',
    type: 'Name of the Son',
    meaning: '“Yahweh saves” — “for he will save his people from their sins” (Matt 1:21)',
    short: 'Yeshua is a short form of Yehoshua (Joshua). The angel gave the name before His birth, declaring His mission in His name.',
    forms: [
      { orig: 'יֵשׁוּעַ', lang: 'Hebrew', translit: 'ye·shu·a', strong: 'H3442', english: 'Yeshua' },
      { orig: 'Ἰησοῦς', lang: 'Greek', translit: 'Iēsous', strong: 'G2424', english: 'Jesus', nt: true },
    ],
    keyRefs: ['Matt.1.21', 'Luke.1.31', 'Acts.4.12', 'Phil.2.9-11'],
  },
  'div:messiah': {
    name: 'Christ / Messiah',
    type: 'Title of the Son',
    meaning: '“The Anointed One” — the King anointed by God’s Spirit',
    short: 'Mashiach (Hebrew) and Christos (Greek) both mean “anointed.” Prophets, priests and kings were anointed with oil; Jesus was anointed with the Holy Spirit and power.',
    forms: [
      { orig: 'מָשִׁיחַ', lang: 'Hebrew', translit: 'ma·shi·ach', strong: 'H4899', english: 'Messiah' },
      { orig: 'Χριστός', lang: 'Greek', translit: 'Christos', strong: 'G5547', english: 'Christ', nt: true },
    ],
    keyRefs: ['Ps.2.2', 'Dan.9.25', 'John.1.41', 'Acts.10.38'],
  },
  'div:ruach': {
    name: 'Holy Spirit',
    type: 'Name of the Spirit',
    meaning: '“Holy Breath, Holy Wind” — God’s own presence and power',
    short: 'Ruach means breath, wind and spirit. The same Spirit who hovered over the waters at creation was poured out on all believers at Pentecost.',
    forms: [
      { orig: 'רוּחַ הַקֹּדֶשׁ', lang: 'Hebrew', translit: 'ru·ach ha·ko·desh', strong: 'H7307', english: 'Holy Spirit' },
      { orig: 'Πνεῦμα Ἅγιον', lang: 'Greek', translit: 'Pneuma Hagion', strong: 'G4151', english: 'Holy Spirit', nt: true },
    ],
    keyRefs: ['Gen.1.2', 'Ps.51.11', 'Joel.2.28', 'Acts.2.4'],
  },
  'div:immanuel': {
    name: 'Immanuel',
    type: 'Name of the Son',
    meaning: '“God with us” (Matt 1:23)',
    short: 'The sign-name promised through Isaiah and fulfilled in the birth of Jesus.',
    forms: [
      { orig: 'עִמָּנוּאֵל', lang: 'Hebrew', translit: 'im·ma·nu·el', strong: 'H6005', english: 'Immanuel' },
      { orig: 'Ἐμμανουήλ', lang: 'Greek', translit: 'Emmanouēl', strong: 'G1694', english: 'Immanuel', nt: true },
    ],
    keyRefs: ['Isa.7.14', 'Isa.8.8', 'Matt.1.23'],
  },
  'div:abba': {
    name: 'Abba',
    type: 'Divine address',
    meaning: '“Father” — the intimate word of a child for its father (Aramaic)',
    short: 'Jesus prayed “Abba, Father,” and the Spirit of adoption teaches believers to cry out the same.',
    forms: [
      { orig: 'אַבָּא', lang: 'Aramaic', translit: 'ab·ba', strong: 'G0005', english: 'Abba' },
      { orig: 'Ἀββά', lang: 'Greek', translit: 'Abba', strong: 'G0005', english: 'Abba', nt: true },
    ],
    keyRefs: ['Mark.14.36', 'Rom.8.15', 'Gal.4.6'],
  },
  'div:sonofman': {
    name: 'Son of Man',
    type: 'Title of the Son',
    meaning: '“The Human One” — the heavenly figure given everlasting dominion (Dan 7:13–14)',
    short: 'Jesus’ favorite title for Himself, drawn from Daniel’s vision of one “like a son of man” coming with the clouds of heaven.',
    forms: [
      { orig: 'בַּר אֱנָשׁ', lang: 'Aramaic', translit: 'bar e·nash', strong: 'H1247', english: 'son of man' },
      { orig: 'ὁ υἱὸς τοῦ ἀνθρώπου', lang: 'Greek', translit: 'ho huios tou anthrōpou', strong: 'G5207', english: 'Son of Man', nt: true },
    ],
    keyRefs: ['Dan.7.13-14', 'Mark.2.10', 'Mark.14.62', 'John.3.13'],
  },
}

// Words in the NLT text that link to each entry. Longer phrases are matched first.
export const DIVINE_WORDS = [
  ['Heaven’s Armies', 'div:sabaoth'],
  ['Holy Spirit', 'div:ruach'],
  ['Son of Man', 'div:sonofman'],
  ['Most High', 'div:elyon'],
  ['Almighty', 'div:shaddai'],
  ['Immanuel', 'div:immanuel'],
  ['Messiah', 'div:messiah'],
  ['Christ', 'div:messiah'],
  ['Jesus', 'div:yeshua'],
  ['Abba', 'div:abba'],
  ['God', 'div:elohim'],
  ['Lord', 'div:adonai'],
]

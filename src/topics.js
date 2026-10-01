// Curated topical index with a Spirit-filled / charismatic emphasis.
// Refs use the same OSIS-style codes as the cross-reference data. Verse text is fetched live from the NLT API.

export const TOPICS = [
  {
    id: 'promises',
    title: "God's Promises",
    keywords: ['promise', 'promises', 'gods promises', 'covenant', 'yes and amen'],
    blurb: 'Every promise of God finds its Yes in Christ (2 Cor 1:20). Organized by what He has pledged to His people.',
    sections: [
      { heading: 'His Word never fails', refs: ['Num.23.19', '2Cor.1.20', 'Isa.55.11', 'Josh.21.45', 'Heb.10.23', 'Matt.24.35', '2Pet.1.4'] },
      { heading: 'Salvation & eternal life', refs: ['John.3.16', 'John.5.24', 'John.10.28', 'Rom.10.9', 'Rom.10.13', 'Acts.2.21', '1John.5.11-12'] },
      { heading: 'Forgiveness & cleansing', refs: ['1John.1.9', 'Isa.1.18', 'Ps.103.12', 'Isa.43.25', 'Mic.7.19', 'Heb.8.12', 'Rom.8.1'] },
      { heading: 'His presence with you', refs: ['Deut.31.6', 'Josh.1.9', 'Heb.13.5', 'Matt.28.20', 'Isa.41.10', 'Isa.43.2', 'Ps.23.4', 'Zeph.3.17'] },
      { heading: 'The gift of the Holy Spirit', refs: ['Joel.2.28-29', 'Acts.1.8', 'Acts.2.38-39', 'Luke.11.13', 'John.14.16-17', 'Ezek.36.26-27', 'John.7.38-39'] },
      { heading: 'Healing', refs: ['Exod.15.26', 'Isa.53.5', 'Ps.103.2-3', 'Jer.30.17', 'Jas.5.14-15', '1Pet.2.24', 'Mal.4.2', 'Ps.107.20'] },
      { heading: 'Provision', refs: ['Phil.4.19', 'Matt.6.33', 'Ps.37.25', '2Cor.9.8', 'Ps.34.10', 'Ps.84.11', 'Luke.6.38', 'Mal.3.10'] },
      { heading: 'Protection', refs: ['Ps.91.1-2', 'Ps.91.11', 'Isa.54.17', '2Thess.3.3', 'Ps.121.7-8', 'Prov.18.10', 'Ps.46.1'] },
      { heading: 'Peace', refs: ['John.14.27', 'Phil.4.6-7', 'Isa.26.3', 'Matt.11.28', 'Rom.5.1', 'Ps.4.8'] },
      { heading: 'Strength', refs: ['Isa.40.29', 'Isa.40.31', '2Cor.12.9', 'Phil.4.13', 'Neh.8.10', 'Ps.73.26'] },
      { heading: 'Guidance & wisdom', refs: ['Prov.3.5-6', 'Ps.32.8', 'Isa.30.21', 'Jas.1.5', 'John.16.13', 'Ps.119.105'] },
      { heading: 'Answered prayer', refs: ['Jer.33.3', 'Matt.7.7', 'Mark.11.24', 'John.14.13-14', 'John.15.7', '1John.5.14-15', 'Matt.18.19'] },
      { heading: 'Victory', refs: ['Rom.8.37', '1Cor.15.57', '2Cor.2.14', '1John.4.4', '1John.5.4', 'Luke.10.19'] },
      { heading: 'A good future', refs: ['Jer.29.11', 'Rom.8.28', 'Phil.1.6', 'Ps.138.8', 'Isa.43.18-19', 'Joel.2.25'] },
      { heading: 'Unfailing love', refs: ['Rom.8.38-39', 'Jer.31.3', 'Lam.3.22-23', 'Isa.54.10', 'Ps.136.1'] },
      { heading: 'His return & eternal hope', refs: ['John.14.2-3', '1Thess.4.16-17', 'Titus.2.13', 'Rev.21.4', '2Pet.3.13'] },
    ],
  },
  {
    id: 'divinity',
    title: 'The Divinity of Jesus',
    keywords: ['divinity', 'deity', 'jesus divinity', 'jesuss divinity', 'jesus is god', 'deity of christ', 'son of god', 'i am', 'incarnation', 'trinity'],
    blurb: 'Jesus is fully God: the eternal Word made flesh, worshiped and called God.',
    sections: [
      { heading: 'The Word was God', refs: ['John.1.1-3', 'John.1.14', 'John.1.18', 'Col.1.15-17', 'Col.2.9', 'Heb.1.3'] },
      { heading: 'Foretold as God with us', refs: ['Isa.7.14', 'Matt.1.23', 'Isa.9.6', 'Mic.5.2', 'Jer.23.5-6', 'Dan.7.13-14', 'Ps.110.1'] },
      { heading: '“I AM”', refs: ['Exod.3.14', 'John.8.58', 'John.18.5-6', 'John.10.30', 'John.14.9'] },
      { heading: 'Called God', refs: ['John.20.28', 'Titus.2.13', 'Rom.9.5', '2Pet.1.1', 'Heb.1.8', 'Phil.2.5-7'] },
      { heading: 'Worshiped as God', refs: ['Matt.14.33', 'Matt.28.9', 'Matt.28.17', 'Heb.1.6', 'Rev.5.12-14', 'Phil.2.9-11'] },
      { heading: 'Doing what only God can do', refs: ['Mark.2.5-7', 'Mark.4.39-41', 'John.5.18', 'John.5.21-23', 'John.11.25', 'Matt.28.18'] },
      { heading: 'The First and the Last', refs: ['Rev.1.8', 'Rev.1.17-18', 'Rev.22.13', 'Isa.44.6', 'Heb.13.8'] },
    ],
  },
  {
    id: 'holy-spirit',
    title: 'The Holy Spirit',
    keywords: ['holy spirit', 'spirit', 'holy ghost', 'comforter', 'advocate', 'helper', 'paraclete'],
    blurb: 'The Person, promise and ministry of the Holy Spirit.',
    sections: [
      { heading: 'The promise of the Father', refs: ['Joel.2.28-29', 'Ezek.36.26-27', 'Isa.44.3', 'Luke.24.49', 'John.14.16-17', 'John.16.7', 'Acts.1.4-5'] },
      { heading: 'He teaches & guides', refs: ['John.14.26', 'John.16.13', 'Rom.8.14', '1Cor.2.10-12', '1John.2.27'] },
      { heading: 'He empowers', refs: ['Acts.1.8', 'Zech.4.6', 'Rom.8.11', 'Rom.15.13', 'Eph.3.16', 'Mic.3.8'] },
      { heading: 'He helps us pray', refs: ['Rom.8.26-27', 'Jude.1.20', 'Eph.6.18', 'Gal.4.6'] },
      { heading: 'He seals & assures', refs: ['Rom.8.16', 'Eph.1.13-14', '2Cor.1.21-22', '1Cor.6.19'] },
      { heading: 'Walking in the Spirit', refs: ['Gal.5.16', 'Gal.5.25', 'Rom.8.5-6', '2Cor.3.17-18', 'Eph.5.18'] },
      { heading: 'Do not grieve or quench Him', refs: ['Eph.4.30', '1Thess.5.19-21', 'Isa.63.10', 'Acts.7.51'] },
    ],
  },
  {
    id: 'baptism-spirit',
    title: 'Baptism in the Spirit',
    keywords: ['baptism', 'baptized', 'baptism in the spirit', 'filled', 'filling', 'pentecost', 'infilling', 'outpouring'],
    blurb: 'Jesus baptizes with the Holy Spirit and fire — the pattern from Pentecost through Acts.',
    sections: [
      { heading: 'Jesus the Baptizer', refs: ['Matt.3.11', 'Mark.1.8', 'John.1.33', 'Luke.24.49', 'Acts.1.5'] },
      { heading: 'Power to witness', refs: ['Acts.1.8', 'Acts.4.31', 'Acts.4.33', 'Luke.4.14'] },
      { heading: 'Pentecost', refs: ['Acts.2.1-4', 'Acts.2.16-18', 'Acts.2.33', 'Acts.2.38-39'] },
      { heading: 'The pattern in Acts', refs: ['Acts.8.14-17', 'Acts.9.17', 'Acts.10.44-46', 'Acts.11.15-17', 'Acts.19.1-6'] },
      { heading: 'Ask and receive', refs: ['Luke.11.13', 'John.7.37-39', 'Gal.3.14', 'Eph.5.18'] },
    ],
  },
  {
    id: 'gifts',
    title: 'Gifts of the Spirit',
    keywords: ['gifts', 'spiritual gifts', 'charismata', 'gift', 'manifestation', 'word of knowledge', 'word of wisdom', 'discernment', 'discerning of spirits'],
    blurb: 'The manifestations of the Spirit given for the common good, with examples in action.',
    sections: [
      { heading: 'Given for the good of all', refs: ['1Cor.12.4-7', '1Cor.12.8-11', '1Cor.12.31', '1Cor.14.1', '1Cor.14.12', '1Pet.4.10-11', '2Tim.1.6'] },
      { heading: 'Revelation gifts: wisdom, knowledge, discernment', refs: ['1Cor.12.8', '1Cor.12.10', 'John.1.47-49', 'John.4.17-19', 'Acts.5.3-4', 'Acts.16.16-18', 'Acts.27.10'] },
      { heading: 'Power gifts: faith, healing, miracles', refs: ['1Cor.12.9-10', 'Mark.16.17-18', 'Acts.3.6-8', 'Acts.9.40', 'Acts.19.11-12', 'Heb.2.4', 'Gal.3.5'] },
      { heading: 'Vocal gifts: prophecy, tongues, interpretation', refs: ['1Cor.14.3', '1Cor.14.5', '1Cor.14.13', '1Cor.14.26', '1Cor.14.39-40'] },
      { heading: 'Ministry & service gifts', refs: ['Rom.12.6-8', 'Eph.4.11-13', '1Cor.12.28'] },
      { heading: 'The way of love', refs: ['1Cor.12.31', '1Cor.13.1-3', '1Cor.13.8-10', '1Cor.14.1'] },
    ],
  },
  {
    id: 'tongues',
    title: 'Speaking in Tongues',
    keywords: ['tongues', 'prayer language', 'speaking in tongues', 'languages', 'glossolalia', 'praying in the spirit'],
    blurb: 'Tongues as a sign, a prayer language, and (with interpretation) a gift to the church.',
    sections: [
      { heading: 'A sign that follows believers', refs: ['Mark.16.17', 'Isa.28.11', '1Cor.14.21-22'] },
      { heading: 'In the book of Acts', refs: ['Acts.2.4', 'Acts.2.6-11', 'Acts.10.45-46', 'Acts.19.6'] },
      { heading: 'Praying in the Spirit', refs: ['1Cor.14.2', '1Cor.14.4', '1Cor.14.14-15', '1Cor.14.18', 'Jude.1.20', 'Rom.8.26', 'Eph.6.18'] },
      { heading: 'In the gathering', refs: ['1Cor.14.5', '1Cor.14.13', '1Cor.14.27-28', '1Cor.14.39-40', '1Cor.12.10'] },
    ],
  },
  {
    id: 'prophecy',
    title: 'Prophecy',
    keywords: ['prophecy', 'prophetic', 'prophet', 'prophesy', 'prophesying', 'word from god'],
    blurb: 'Strengthening, encouraging and comforting — and testing every word.',
    sections: [
      { heading: 'God speaks through His people', refs: ['Num.11.29', 'Amos.3.7', 'Joel.2.28', 'Acts.2.17-18', '2Pet.1.21', 'Rev.19.10'] },
      { heading: 'Purpose of prophecy', refs: ['1Cor.14.1', '1Cor.14.3', '1Cor.14.24-25', '1Cor.14.31', '1Tim.1.18', '1Tim.4.14'] },
      { heading: 'Prophets in the New Testament', refs: ['Acts.11.27-28', 'Acts.13.1-2', 'Acts.15.32', 'Acts.21.9-11', 'Eph.4.11'] },
      { heading: 'Test every word', refs: ['1Thess.5.19-21', '1Cor.14.29', '1John.4.1', 'Deut.18.22', 'Matt.7.15-16'] },
    ],
  },
  {
    id: 'healing',
    title: 'Divine Healing',
    keywords: ['healing', 'heal', 'healed', 'sickness', 'sick', 'health', 'disease', 'jehovah rapha'],
    blurb: 'The Lord who heals — in His nature, in the cross, in the ministry of Jesus, and through His church.',
    sections: [
      { heading: 'The Lord who heals', refs: ['Exod.15.26', 'Exod.23.25', 'Ps.103.2-3', 'Ps.107.20', 'Ps.147.3', 'Jer.17.14', 'Jer.30.17', 'Mal.4.2'] },
      { heading: 'Healing in the atonement', refs: ['Isa.53.4-5', 'Matt.8.16-17', '1Pet.2.24'] },
      { heading: 'Jesus healed them all', refs: ['Matt.4.23-24', 'Matt.8.2-3', 'Matt.9.35', 'Matt.12.15', 'Mark.5.34', 'Luke.4.18', 'Luke.6.19', 'Acts.10.38'] },
      { heading: 'Believers lay hands on the sick', refs: ['Mark.16.17-18', 'Matt.10.7-8', 'Luke.10.9', 'John.14.12', 'Acts.3.6-8', 'Acts.5.15-16', 'Acts.28.8'] },
      { heading: 'The prayer of faith', refs: ['Jas.5.14-16', 'Mark.11.23-24', 'Matt.9.29', 'Prov.4.20-22', '3John.1.2'] },
    ],
  },
  {
    id: 'miracles',
    title: 'Signs, Wonders & Miracles',
    keywords: ['miracles', 'miracle', 'signs', 'wonders', 'signs and wonders', 'power', 'supernatural'],
    blurb: 'The gospel confirmed with power — then and now.',
    sections: [
      { heading: 'The Word confirmed', refs: ['Mark.16.20', 'Heb.2.3-4', 'Acts.14.3', 'Rom.15.18-19', '1Cor.2.4-5', '1Cor.4.20'] },
      { heading: 'The early church', refs: ['Acts.2.43', 'Acts.4.29-30', 'Acts.5.12', 'Acts.6.8', 'Acts.8.6-7', 'Acts.19.11'] },
      { heading: 'Greater works', refs: ['John.14.12', 'Mark.9.23', 'Matt.17.20', 'Luke.1.37', 'Jer.32.27', 'Eph.3.20'] },
    ],
  },
  {
    id: 'faith',
    title: 'Faith',
    keywords: ['faith', 'believe', 'belief', 'trust', 'mountain moving'],
    blurb: 'Faith that pleases God and moves mountains.',
    sections: [
      { heading: 'What faith is', refs: ['Heb.11.1', 'Heb.11.6', '2Cor.5.7', 'Rom.4.20-21', 'Hab.2.4'] },
      { heading: 'How faith comes', refs: ['Rom.10.17', 'Rom.12.3', 'Gal.5.22', 'Heb.12.2'] },
      { heading: 'Faith that moves mountains', refs: ['Mark.11.22-24', 'Matt.17.20', 'Matt.21.21-22', 'Mark.9.23', 'Luke.17.6'] },
      { heading: 'Faith overcomes', refs: ['1John.5.4', 'Eph.6.16', 'Jas.1.6', 'Gal.2.20', 'Heb.11.33-34'] },
    ],
  },
  {
    id: 'authority',
    title: 'Authority & Spiritual Warfare',
    keywords: ['authority', 'spiritual warfare', 'warfare', 'armor', 'armor of god', 'enemy', 'devil', 'satan', 'bind', 'loose', 'weapons'],
    blurb: "The believer's authority in Christ and the weapons of our warfare.",
    sections: [
      { heading: 'Authority given to believers', refs: ['Luke.10.19', 'Luke.9.1', 'Matt.28.18-19', 'Matt.16.19', 'Matt.18.18', 'Mark.16.17'] },
      { heading: 'Seated with Christ', refs: ['Eph.1.19-22', 'Eph.2.6', 'Col.2.9-10', 'Col.2.15', '1John.3.8'] },
      { heading: 'The armor of God', refs: ['Eph.6.10-12', 'Eph.6.13-17', 'Eph.6.18'] },
      { heading: 'Weapons of our warfare', refs: ['2Cor.10.3-5', 'Heb.4.12', 'Rev.12.11', 'Isa.54.17', '1John.4.4'] },
      { heading: 'Resist the enemy', refs: ['Jas.4.7', '1Pet.5.8-9', 'Eph.4.27', '2Cor.2.11', 'Matt.4.10'] },
    ],
  },
  {
    id: 'deliverance',
    title: 'Deliverance & Freedom',
    keywords: ['deliverance', 'freedom', 'free', 'bondage', 'set free', 'chains', 'oppression', 'liberty'],
    blurb: 'Jesus came to set captives free.',
    sections: [
      { heading: 'Sent to set captives free', refs: ['Isa.61.1', 'Luke.4.18', '1John.3.8', 'Acts.10.38', 'Col.1.13'] },
      { heading: 'Free indeed', refs: ['John.8.32', 'John.8.36', 'Gal.5.1', '2Cor.3.17', 'Rom.6.14', 'Rom.8.2'] },
      { heading: 'Jesus casts out demons', refs: ['Mark.1.34', 'Matt.8.16', 'Matt.12.28', 'Luke.13.12-13', 'Mark.16.17'] },
      { heading: 'Cry out — He delivers', refs: ['Ps.34.17', 'Ps.34.19', 'Ps.107.6', 'Ps.18.2', 'Ps.50.15', '2Tim.4.18'] },
    ],
  },
  {
    id: 'evil-defeated',
    title: 'Evil Is Defeated',
    keywords: ['evil is defeated', 'evil defeated', 'evil', 'defeated', 'defeat', 'victory over evil', 'satan defeated', 'triumph', 'overcome', 'overcomer', 'darkness', 'death defeated'],
    blurb: 'Promised in the garden, won at the cross, enforced by His people, and finished at His return.',
    sections: [
      { heading: 'The first promise', refs: ['Gen.3.15', 'Rom.16.20', 'Isa.53.5', 'Gal.4.4-5'] },
      { heading: 'Disarmed at the cross', refs: ['Col.2.13-15', 'Heb.2.14-15', '1John.3.8', 'John.12.31-32', 'John.16.11', 'John.19.30'] },
      { heading: 'Satan cast down', refs: ['Luke.10.18-19', 'Rev.12.7-9', 'Rev.12.10-11', 'Isa.14.12-15', 'Matt.12.28-29'] },
      { heading: 'Death has lost its sting', refs: ['1Cor.15.54-57', 'Hos.13.14', 'Isa.25.8', '2Tim.1.10', 'Rev.1.17-18'] },
      { heading: 'The light overcomes the darkness', refs: ['John.1.5', 'John.16.33', 'Col.1.13', '1John.4.4', '1John.5.4-5', 'Rom.8.37'] },
      { heading: 'Overcome evil with good', refs: ['Rom.12.21', 'Gen.50.20', 'Jas.4.7', 'Eph.6.10-11', '1Pet.5.8-10'] },
      { heading: 'The wicked will not last', refs: ['Ps.37.1-2', 'Ps.37.10-11', 'Ps.92.7', 'Prov.24.19-20', 'Mal.4.1-3'] },
      { heading: 'The final victory', refs: ['Rev.20.10', 'Rev.20.14', 'Rev.21.3-4', 'Rev.22.3', '1Cor.15.24-26', 'Rev.11.15'] },
    ],
  },
  {
    id: 'rest',
    title: 'His Rest',
    keywords: ['rest', 'his rest', 'sabbath', 'weary', 'tired', 'burnout', 'sleep', 'stillness', 'be still', 'striving'],
    blurb: 'Come to Me and I will give you rest. A rest that remains for the people of God.',
    sections: [
      { heading: 'Come to Me', refs: ['Matt.11.28-30', 'Exod.33.14', 'Jer.6.16', 'Isa.30.15', 'Ps.23.1-3'] },
      { heading: 'A Sabbath rest remains', refs: ['Gen.2.2-3', 'Mark.2.27', 'Heb.4.1', 'Heb.4.3', 'Heb.4.9-11'] },
      { heading: 'Be still and trust', refs: ['Ps.46.10', 'Ps.37.7', 'Ps.62.1-2', 'Ps.62.5', 'Ps.116.7', 'Isa.26.3'] },
      { heading: 'Rest for the weary', refs: ['Isa.40.29-31', 'Jer.31.25', 'Mark.6.31', 'Isa.28.12', 'Isa.11.10'] },
      { heading: 'He gives His beloved sleep', refs: ['Ps.4.8', 'Ps.3.5', 'Ps.127.2', 'Prov.3.24', 'Mark.4.38-40'] },
    ],
  },
  {
    id: 'restoration',
    title: 'Restoration',
    keywords: ['restoration', 'restore', 'restored', 'renewal', 'recompense', 'second chance', 'rebuild', 'redeemed', 'what was lost'],
    blurb: 'God restores souls, years, fortunes and callings, and makes all things new.',
    sections: [
      { heading: 'He restores my soul', refs: ['Ps.23.3', 'Ps.51.10-12', 'Ps.71.20-21', 'Ps.80.3', 'Ps.126.1-3'] },
      { heading: 'Restoring what was lost', refs: ['Joel.2.25-26', 'Job.42.10', 'Zech.9.12', 'Isa.61.7', 'Deut.30.3', 'Jer.30.17'] },
      { heading: 'Restored after failure', refs: ['Luke.22.31-32', 'John.21.15-17', 'Luke.15.20-24', 'Gal.6.1', 'Mic.7.8'] },
      { heading: 'Beauty for ashes', refs: ['Isa.61.3', 'Isa.61.4', 'Isa.58.12', 'Amos.9.14', 'Ezek.37.4-6'] },
      { heading: 'All things made new', refs: ['1Pet.5.10', 'Acts.3.19-21', '2Cor.5.17', 'Isa.43.18-19', 'Rev.21.5'] },
    ],
  },
  {
    id: 'courts',
    title: 'The Courts of Heaven',
    keywords: ['courts of heaven', 'court of heaven', 'courts', 'court', 'courtroom', 'heavenly court', 'judge', 'accuser', 'advocate', 'verdict', 'books opened', 'legal'],
    blurb: 'The Ancient of Days takes His seat and the books are opened. The accuser brings charges, but we have an Advocate whose blood speaks a better word.',
    sections: [
      { heading: 'The court is seated', refs: ['Dan.7.9-10', 'Dan.7.13-14', 'Dan.7.21-22', 'Dan.7.26-27', 'Ps.82.1', 'Rev.4.2-5'] },
      { heading: 'The righteous Judge', refs: ['Gen.18.25', 'Ps.7.11', 'Ps.9.7-8', 'Ps.89.14', 'Heb.12.22-24', 'Jas.4.12'] },
      { heading: 'The accuser', refs: ['Job.1.6-12', 'Zech.3.1-5', 'Rev.12.10', '1Pet.5.8', 'Luke.22.31-32'] },
      { heading: 'Our Advocate', refs: ['1John.2.1-2', 'Rom.8.33-34', 'Heb.7.25', 'Heb.9.24', 'Isa.53.12', 'Job.16.19-21'] },
      { heading: 'Present your case', refs: ['Isa.43.26', 'Isa.1.18', 'Isa.41.21', 'Job.23.3-7', 'Luke.18.1-8', 'Heb.4.16'] },
      { heading: 'The books are opened', refs: ['Dan.7.10', 'Ps.139.16', 'Mal.3.16', 'Rev.20.12', 'Rev.5.1-5'] },
      { heading: 'The verdict: no condemnation', refs: ['Rom.8.1', 'Col.2.13-15', 'Isa.54.17', 'Rev.12.11', 'Heb.10.19-22', 'Mic.7.9'] },
    ],
  },
  {
    id: 'name-blood',
    title: 'The Name & the Blood',
    keywords: ['name of jesus', 'blood', 'name', 'blood of jesus', 'atonement', 'covering', 'plead the blood'],
    blurb: 'The power of the Name of Jesus and the blood of the Lamb.',
    sections: [
      { heading: 'The Name above every name', refs: ['Phil.2.9-11', 'Acts.4.12', 'Prov.18.10', 'Col.3.17'] },
      { heading: 'In His Name', refs: ['John.14.13-14', 'John.16.23-24', 'Acts.3.6', 'Acts.3.16', 'Acts.16.18', 'Mark.16.17'] },
      { heading: 'The blood of the Lamb', refs: ['Exod.12.13', 'Eph.1.7', '1John.1.7', 'Heb.9.14', 'Heb.10.19', 'Heb.12.24', '1Pet.1.18-19', 'Rev.12.11', 'Col.1.20'] },
    ],
  },
  {
    id: 'worship',
    title: 'Worship & Praise',
    keywords: ['worship', 'praise', 'thanksgiving', 'singing', 'dance', 'music', 'hallelujah', 'glory'],
    blurb: 'Spirit-and-truth worship that ushers in His presence.',
    sections: [
      { heading: 'In spirit and in truth', refs: ['John.4.23-24', 'Ps.29.2', 'Ps.95.6', 'Rev.4.11', 'Rom.12.1'] },
      { heading: 'Enthroned on praise', refs: ['Ps.22.3', 'Ps.100.4', 'Ps.16.11', '2Chr.5.13-14', 'Heb.13.15'] },
      { heading: 'Praise as warfare', refs: ['2Chr.20.21-22', 'Acts.16.25-26', 'Ps.149.6', 'Josh.6.20'] },
      { heading: 'Sing, shout & dance', refs: ['Ps.150.1-6', 'Ps.47.1', 'Ps.149.3', '2Sam.6.14', 'Eph.5.18-19', 'Col.3.16'] },
    ],
  },
  {
    id: 'prayer',
    title: 'Prayer & Intercession',
    keywords: ['prayer', 'pray', 'intercession', 'intercede', 'fasting', 'fast', 'seek'],
    blurb: 'Bold, persistent, Spirit-led prayer.',
    sections: [
      { heading: 'Call to Me', refs: ['Jer.33.3', '2Chr.7.14', 'Matt.6.6', 'Heb.4.16', 'Phil.4.6'] },
      { heading: 'Pray without ceasing', refs: ['1Thess.5.17', 'Luke.18.1', 'Eph.6.18', 'Col.4.2', 'Rom.12.12'] },
      { heading: 'Standing in the gap', refs: ['Ezek.22.30', '1Tim.2.1-2', 'Isa.62.6-7', 'Rom.8.34', 'Heb.7.25'] },
      { heading: 'Agreement & power', refs: ['Matt.18.19-20', 'Acts.4.31', 'Acts.12.5', 'Jas.5.16-18'] },
      { heading: 'Fasting', refs: ['Matt.6.16-18', 'Isa.58.6', 'Joel.2.12', 'Acts.13.2-3', 'Mark.9.29'] },
    ],
  },
  {
    id: 'hearing-god',
    title: "Hearing God's Voice",
    keywords: ['hearing god', 'voice', 'hear god', 'listen', 'leading', 'direction', 'still small voice'],
    blurb: 'My sheep listen to my voice.',
    sections: [
      { heading: 'His sheep hear His voice', refs: ['John.10.3-4', 'John.10.27', 'Isa.30.21', 'Rom.8.14', 'Heb.3.15'] },
      { heading: 'Still, small whisper', refs: ['1Kgs.19.11-12', 'Ps.46.10', '1Sam.3.10', 'Isa.50.4'] },
      { heading: 'Dreams & visions', refs: ['Joel.2.28', 'Acts.2.17', 'Job.33.14-16', 'Acts.16.9-10', 'Acts.10.9-11', 'Num.12.6'] },
      { heading: 'Led by the Spirit', refs: ['John.16.13', 'Acts.13.2', 'Acts.16.6-7', 'Prov.3.5-6', 'Ps.32.8'] },
    ],
  },
  {
    id: 'dreams',
    title: 'Prophetic Dreams',
    keywords: ['prophetic dreams', 'dreams', 'dream', 'visions', 'vision', 'night visions', 'dream interpretation', 'interpretation', 'interpret'],
    blurb: 'God speaks in the night: dreams that reveal destiny, guide and protect, warn kings, and need His interpretation.',
    sections: [
      { heading: 'God speaks in dreams', refs: ['Num.12.6', 'Job.33.14-16', 'Joel.2.28', 'Acts.2.17', 'Ps.16.7', 'Gen.20.3'] },
      { heading: 'Night visions', refs: ['Gen.28.12-15', 'Gen.46.2-3', 'Job.4.13', 'Acts.16.9-10', 'Acts.18.9-10'] },
      { heading: 'Dreams of destiny', refs: ['Gen.37.5-7', 'Gen.37.9', 'Gen.42.9', '1Kgs.3.5', '1Kgs.3.15', 'Judg.7.13-15'] },
      { heading: 'Dreams that guide & protect', refs: ['Matt.1.20-21', 'Matt.2.12', 'Matt.2.13', 'Matt.2.19-20', 'Matt.2.22', 'Matt.27.19'] },
      { heading: 'Dreams for kings & nations', refs: ['Gen.41.25', 'Gen.41.32', 'Dan.2.19', 'Dan.2.27-28', 'Dan.4.18', 'Dan.7.1'] },
      { heading: 'Interpretation belongs to God', refs: ['Gen.40.8', 'Gen.41.15-16', 'Dan.2.22', 'Dan.2.47', 'Dan.5.12', 'Prov.25.2'] },
      { heading: 'Test every dream', refs: ['Deut.13.1-3', 'Jer.23.28', 'Jer.29.8-9', 'Eccl.5.7', '1Thess.5.21', '1John.4.1'] },
    ],
  },
  {
    id: 'anointing',
    title: 'The Anointing',
    keywords: ['anointing', 'anointed', 'anoint', 'oil', 'mantle', 'double portion', 'unction', 'the anointing'],
    blurb: 'From the holy oil poured on priests and kings, to Jesus the Anointed One, to the anointing that now remains on every believer.',
    sections: [
      { heading: 'The holy anointing oil', refs: ['Exod.30.25', 'Exod.30.30-31', 'Exod.40.15', 'Lev.8.12', 'Ps.133.1-2'] },
      { heading: 'Priests, prophets & kings', refs: ['1Sam.10.1', '1Sam.10.6', '1Sam.16.13', '1Kgs.19.16', 'Ps.89.20-21', 'Ps.105.15'] },
      { heading: 'Jesus the Anointed One', refs: ['Isa.61.1-3', 'Luke.4.18-19', 'Acts.10.38', 'Ps.45.7', 'Acts.4.27', 'John.1.32-33'] },
      { heading: 'You have an anointing', refs: ['1John.2.20', '1John.2.27', '2Cor.1.21-22', 'Ps.23.5', 'Ps.92.10'] },
      { heading: 'Power that breaks the yoke', refs: ['Isa.10.27', 'Zech.4.6', 'Mic.3.8', 'Luke.4.36', 'Acts.1.8'] },
      { heading: 'The mantle & a double portion', refs: ['1Kgs.19.19-21', '2Kgs.2.9-10', '2Kgs.2.13-15', 'Num.11.25', 'Num.27.18-20'] },
      { heading: 'Anointing for healing', refs: ['Mark.6.13', 'Jas.5.14-15', 'Mark.16.18'] },
    ],
  },
  {
    id: 'destinies',
    title: 'Destinies',
    keywords: ['destiny', 'destinies', 'purpose', 'plans', 'future', 'predestined', 'calling', 'called', 'assignment', 'commission', 'great commission', 'sent', 'such a time as this', 'prophetic destiny'],
    blurb: 'Known before you were born, every day written in His book, created for good works He prepared in advance.',
    sections: [
      { heading: 'Known before you were born', refs: ['Jer.1.5', 'Ps.139.13-15', 'Isa.49.1', 'Gal.1.15', 'Eph.1.4-5', 'Rom.8.29-30'] },
      { heading: 'Your days are written', refs: ['Ps.139.16', 'Ps.31.15', 'Job.14.5', 'Luke.10.20', 'Rev.3.5'] },
      { heading: 'His plans stand firm', refs: ['Jer.29.11', 'Prov.19.21', 'Prov.16.9', 'Ps.33.11', 'Isa.46.10', 'Ps.138.8'] },
      { heading: 'Called with purpose', refs: ['Eph.2.10', '2Tim.1.9', 'Eph.4.1', 'Rom.11.29', '1Pet.2.9', 'Phil.1.6', 'Phil.2.13', 'Rom.8.28'] },
      { heading: 'For such a time as this', refs: ['Esth.4.14', 'Gen.50.20', 'Gen.45.7-8', 'Judg.6.12-14', 'Acts.13.36'] },
      { heading: 'Sent out', refs: ['Isa.6.8', 'Matt.28.18-20', 'Mark.16.15-18', 'John.20.21-22'] },
      { heading: 'Write the vision, run the race', refs: ['Hab.2.2-3', 'Phil.3.12-14', '1Cor.9.24', 'Heb.12.1-2', 'Acts.20.24', '2Tim.4.7-8'] },
      { heading: 'Your eternal destiny', refs: ['John.14.2-3', '1Cor.2.9', 'Rom.8.17-18', 'Col.3.4', 'Dan.12.3', 'Rev.22.3-5'] },
    ],
  },
  {
    id: 'identity',
    title: 'Identity in Christ',
    keywords: ['identity', 'who i am', 'new creation', 'in christ', 'sonship', 'adoption', 'righteousness', 'chosen'],
    blurb: 'Who you are because of Him.',
    sections: [
      { heading: 'A new creation', refs: ['2Cor.5.17', 'Gal.2.20', 'Col.3.3', 'Rom.6.4', 'Ezek.36.26'] },
      { heading: 'Sons & daughters', refs: ['John.1.12', 'Rom.8.15-17', 'Gal.4.6-7', '1John.3.1', 'Eph.1.5'] },
      { heading: 'Righteous & free from condemnation', refs: ['2Cor.5.21', 'Rom.8.1', 'Rom.5.1', 'Col.1.22', 'Eph.1.7'] },
      { heading: 'Chosen, royal, complete', refs: ['1Pet.2.9', 'Eph.1.3-4', 'Col.2.10', 'Rev.1.5-6', 'Eph.2.10'] },
    ],
  },
  {
    id: 'kingdom',
    title: 'The Kingdom of God',
    keywords: ['kingdom', 'kingdom of god', 'kingdom of heaven', 'reign', 'on earth as in heaven'],
    blurb: 'The Kingdom is not just talk; it is living by God’s power.',
    sections: [
      { heading: 'The Kingdom has come near', refs: ['Mark.1.15', 'Matt.12.28', 'Luke.17.20-21', 'Col.1.13'] },
      { heading: 'Power, not just words', refs: ['1Cor.4.20', 'Rom.14.17', 'Matt.10.7-8', 'Luke.9.2'] },
      { heading: 'Seek it first', refs: ['Matt.6.10', 'Matt.6.33', 'Luke.12.32', 'Matt.13.44'] },
      { heading: 'His Kingdom forever', refs: ['Dan.2.44', 'Dan.7.27', 'Matt.24.14', 'Rev.11.15'] },
    ],
  },
  {
    id: 'revival',
    title: 'Revival & Outpouring',
    keywords: ['revival', 'awakening', 'outpouring', 'rain', 'refreshing', 'renewal', 'fire'],
    blurb: 'Lord, revive Your work in our day.',
    sections: [
      { heading: 'Cry for revival', refs: ['Hab.3.2', 'Ps.85.6', 'Isa.64.1-2', 'Ps.80.18-19', '2Chr.7.14'] },
      { heading: 'Promised outpouring', refs: ['Joel.2.23', 'Joel.2.28-29', 'Isa.44.3', 'Zech.10.1', 'Hos.6.3', 'Acts.2.17-18'] },
      { heading: 'Times of refreshing', refs: ['Acts.3.19-20', 'Isa.43.19', 'Isa.35.1-2', 'Ezek.47.9'] },
      { heading: 'Fire of God', refs: ['Matt.3.11', 'Acts.2.3', 'Luke.12.49', 'Jer.20.9', 'Heb.12.29', 'Rom.12.11'] },
    ],
  },
  {
    id: 'fruit',
    title: 'Fruit of the Spirit',
    keywords: ['fruit', 'fruit of the spirit', 'character', 'love', 'joy', 'patience', 'kindness', 'self-control', 'holiness'],
    blurb: 'Gifts show His power; fruit shows His character.',
    sections: [
      { heading: 'The fruit', refs: ['Gal.5.22-23', 'John.15.4-5', 'John.15.8', 'Matt.7.16-17'] },
      { heading: 'Love above all', refs: ['1Cor.13.1-3', '1Cor.13.4-7', '1Cor.13.13', 'Col.3.14', 'John.13.35'] },
      { heading: 'Growing in Christlikeness', refs: ['2Pet.1.5-8', 'Col.3.12-13', 'Rom.12.9-10', '2Cor.3.18', 'Phil.1.11'] },
    ],
  },
  {
    id: 'fear-not',
    title: 'Fear Not',
    keywords: ['fear', 'fear not', 'anxiety', 'anxious', 'worry', 'afraid', 'courage', 'trouble', 'trials'],
    blurb: 'Peace and courage in the storm.',
    sections: [
      { heading: 'Do not be afraid', refs: ['Isa.41.10', 'Isa.43.1-2', 'Josh.1.9', 'Ps.27.1', 'Ps.56.3-4', 'Deut.31.8'] },
      { heading: 'Not a spirit of fear', refs: ['2Tim.1.7', 'Rom.8.15', '1John.4.18', 'Luke.12.32'] },
      { heading: 'Cast your cares', refs: ['1Pet.5.7', 'Phil.4.6-7', 'Matt.6.34', 'Ps.55.22', 'Matt.11.28-30'] },
      { heading: 'Overcomers in trials', refs: ['John.16.33', 'Rom.8.31', 'Ps.46.1-3', 'Jas.1.2-4', '2Cor.4.17-18', 'Rom.5.3-5'] },
    ],
  },
  {
    id: 'blessing',
    title: 'Blessing & Favor',
    keywords: ['blessing', 'blessed', 'favor', 'prosper', 'prosperity', 'abundance', 'abundant life', 'increase'],
    blurb: 'Every spiritual blessing in Christ, and the favor that surrounds the righteous.',
    sections: [
      { heading: 'Blessed in Christ', refs: ['Eph.1.3', 'Gal.3.13-14', 'Num.6.24-26', 'Ps.5.12'] },
      { heading: 'Abundant life', refs: ['John.10.10', 'Ps.23.5-6', 'Prov.10.22', '3John.1.2', 'Ps.1.1-3'] },
      { heading: 'Generosity & harvest', refs: ['Luke.6.38', '2Cor.9.6-8', 'Prov.3.9-10', 'Mal.3.10', 'Deut.8.18'] },
    ],
  },
]

export const topicById = Object.fromEntries(TOPICS.map((t) => [t.id, t]))

const clean = (s) => s.toLowerCase().replace(/[’'`]/g, '').replace(/[^a-z0-9 -]/g, ' ').replace(/\s+/g, ' ').trim()

/** Returns topics ranked by how well they match a query. */
export function matchTopics(query) {
  const q = clean(query)
  if (q.length < 3) return []
  return TOPICS.map((t) => {
    const title = clean(t.title)
    let score = 0
    if (title === q) score = 100
    else if (t.keywords.some((k) => clean(k) === q)) score = 90
    else if (title.includes(q)) score = 70
    else if (t.keywords.some((k) => clean(k).startsWith(q) || q.includes(clean(k)))) score = 50
    return { topic: t, score }
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.topic)
}

/** Topics whose verse lists include a given verse. */
export function topicsForVerse(book, chapter, verse) {
  const hits = []
  for (const t of TOPICS) {
    for (const s of t.sections) {
      const found = s.refs.some((r) => {
        const [start, end] = r.split('-')
        const [b, c, v] = start.split('.')
        if (b !== book || +c !== chapter) return false
        const last = end && !end.includes('.') ? +end : +v
        return verse >= +v && verse <= last
      })
      if (found) { hits.push({ topic: t, section: s.heading }); break }
    }
  }
  return hits
}

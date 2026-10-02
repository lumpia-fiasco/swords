import { useEffect, useState } from 'react'
import { getEntry } from '../names.js'
import { numberEntry } from '../numbers.js'
import { parseOsis, label } from '../ref.js'
import { bookById } from '../books.js'

// STEPBible refs use their own book codes ("Mat.3.1"); map the ones that differ from ours.
const STEP_BOOK = {
  Exo: 'Exod', Deu: 'Deut', Jos: 'Josh', Jdg: 'Judg', Rut: 'Ruth', '1Sa': '1Sam', '2Sa': '2Sam', '1Ki': '1Kgs',
  '2Ki': '2Kgs', '1Ch': '1Chr', '2Ch': '2Chr', Ezr: 'Ezra', Est: 'Esth', Psa: 'Ps', Pro: 'Prov', Ecc: 'Eccl',
  Sng: 'Song', Ezk: 'Ezek', Jol: 'Joel', Amo: 'Amos', Oba: 'Obad', Jon: 'Jonah', Nam: 'Nah', Zep: 'Zeph',
  Zec: 'Zech', Mat: 'Matt', Mrk: 'Mark', Luk: 'Luke', Jhn: 'John', Act: 'Acts', '1Co': '1Cor', '2Co': '2Cor',
  Php: 'Phil', '1Th': '1Thess', '2Th': '2Thess', '1Ti': '1Tim', '2Ti': '2Tim', Tit: 'Titus', Phm: 'Phlm',
  '1Pe': '1Pet', '2Pe': '2Pet', '1Jn': '1John', '2Jn': '2John', '3Jn': '3John', Jud: 'Jude',
}
function stepRef(s) {
  if (!s) return null
  const [bk, ch, vs] = s.split('.')
  const book = STEP_BOOK[bk] ?? bk
  return bookById[book] ? { book, chapter: +ch, verse: +vs || undefined } : null
}

const FAMILY = [
  ['parents', 'Parents'],
  ['siblings', 'Siblings'],
  ['partners', 'Spouses'],
  ['offspring', 'Children'],
]

const TYPE_LABEL = { PERSON: 'Person', PLACE: 'Place', 'PLACE+PERSON': 'Place & person', OTHER: 'Name', DIVINE: 'Name of God' }

function Original({ form, primary }) {
  const rtl = form.lang === 'Hebrew' || form.lang === 'Aramaic'
  const script = rtl ? 'heb' : form.lang === 'Geʽez' ? 'eth' : 'grk'
  const lang = { heb: 'he', eth: 'gez', grk: 'el' }[script]
  return (
    <div className={`orig ${primary ? 'primary' : ''}`}>
      <span className={`orig-script ${script}`} dir={rtl ? 'rtl' : 'ltr'} lang={lang}>{form.orig}</span>
      <span className="orig-meta">
        <span className="orig-lang">{form.lang}</span>
        {form.translit && <span className="orig-translit">{form.translit}</span>}
        {!primary && form.english && <span className="orig-en">“{form.english}”</span>}
        {!primary && form.meaning && <span className="orig-meaning">{form.meaning}</span>}
      </span>
    </div>
  )
}

function Entry({ entry, nt, onPick, onOpen }) {
  // Lead with the language of the testament being read when the name has both.
  const forms = [...(entry.forms ?? [])].sort((a, b) => {
    const score = (f) => (nt ? (f.lang === 'Greek' ? 0 : 1) : f.lang === 'Greek' ? 1 : 0)
    return score(a) - score(b)
  })
  // The page is about Hebrew names, so show the Hebrew behind a Greek name prominently.
  const hebrewFirst = entry.hebrew && !forms.some((f) => f.lang !== 'Greek')
  const [lead, ...rest] = forms
  const first = stepRef(entry.firstRef)
  const kind = entry.kind === 'PERSON' && entry.type ? `${TYPE_LABEL.PERSON} · ${entry.type}` : entry.type && entry.kind !== 'PLACE' ? entry.type : TYPE_LABEL[entry.kind]

  return (
    <article className="name-entry">
      <p className="eyebrow">{kind}</p>
      <h2 className="name-title">{entry.name}</h2>
      {entry.brief && <p className="name-brief">{entry.brief}</p>}

      {hebrewFirst && <Original primary form={{ ...entry.hebrew, lang: 'Hebrew' }} />}
      {lead && <Original primary={!hebrewFirst} form={lead} />}

      <div className="meaning">
        <span className="meaning-label">Meaning</span>
        <p>{entry.meaning ?? 'Not recorded in the lexicon.'}</p>
      </div>

      {entry.short && <p className="name-desc">{entry.short}</p>}

      {rest.length > 0 && (
        <section className="name-section">
          <h3>Other forms</h3>
          {rest.map((f) => <Original key={f.orig + f.lang} form={f} />)}
        </section>
      )}

      {FAMILY.some(([k]) => entry[k]?.length) && (
        <section className="name-section">
          <h3>Family</h3>
          <dl className="family">
            {FAMILY.filter(([k]) => entry[k]?.length).map(([k, title]) => (
              <div key={k}>
                <dt>{title}</dt>
                <dd>
                  {entry[k].map((p, i) =>
                    p.id ? (
                      <button key={i} className="chip" onClick={() => onPick([p.id])}>{p.name}</button>
                    ) : (
                      <span key={i} className="chip static">{p.name}</span>
                    ),
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {(first || entry.keyRefs) && (
        <section className="name-section">
          <h3>{entry.keyRefs ? 'Key passages' : 'First mentioned'}</h3>
          <div className="ref-links">
            {entry.keyRefs
              ? entry.keyRefs.map((r) => <button key={r} className="chip" onClick={() => onOpen(parseOsis(r))}>{label(parseOsis(r))}</button>)
              : <button className="chip" onClick={() => onOpen(first)}>{label(first)}</button>}
          </div>
        </section>
      )}

      <p className="strongs">
        {[...(hebrewFirst ? [entry.hebrew] : []), ...forms].map((f) => f.strong).filter(Boolean).join(' · ')}
      </p>
    </article>
  )
}

function NumberEntry({ value, word, onOpen }) {
  const e = numberEntry(value)
  return (
    <article className="name-entry">
      <h2 className="name-title num-title">
        {value.toLocaleString()}
        {word && word.replace(/,/g, '') !== String(value) && <span className="num-word">{word.toLowerCase()}</span>}
      </h2>
      {e.hebrew && <Original primary form={{ ...e.hebrew, lang: 'Hebrew' }} />}
      <div className={`meaning ${e.none ? 'none' : ''}`}>
        <span className="meaning-label">Biblical meaning</span>
        <p>{e.meaning}</p>
      </div>
      <p className="name-desc">{e.short}</p>
      {e.keyRefs && (
        <section className="name-section">
          <h3>Key passages</h3>
          <div className="ref-links">
            {e.keyRefs.map((r) => <button key={r} className="chip" onClick={() => onOpen(parseOsis(r))}>{label(parseOsis(r))}</button>)}
          </div>
        </section>
      )}
      <p className="attribution">
        Numbers in Scripture are first literal counts. These meanings are patterns drawn from the passages above, not a code; where Scripture gives no clear pattern, that is stated.
      </p>
    </article>
  )
}

export default function NamePanel({ view, onClose, onOpen }) {
  // A small history so family links can be followed and retraced.
  const [stack, setStack] = useState([])
  const [entries, setEntries] = useState(null)
  const current = stack.at(-1)

  useEffect(() => {
    setStack(view?.ids ? [view.ids] : [])
  }, [view])

  useEffect(() => {
    let live = true
    setEntries(null)
    if (current) Promise.all(current.map(getEntry)).then((es) => live && setEntries(es.filter(Boolean)))
    return () => { live = false }
  }, [current])

  if (!view) return null
  if (view.number) {
    return (
      <aside className="name-panel" aria-label="Number details">
        <div className="name-panel-bar">
          <span className="name-panel-label">Number</span>
          <button className="icon-btn" onClick={onClose} aria-label="Close number details">✕</button>
        </div>
        <div className="name-panel-body">
          <NumberEntry key={view.number} value={view.number} word={view.word} onOpen={onOpen} />
        </div>
      </aside>
    )
  }
  const nt = view.nt
  return (
    <aside className="name-panel" aria-label="Name details">
      <div className="name-panel-bar">
        {stack.length > 1 ? (
          <button className="back" onClick={() => setStack((s) => s.slice(0, -1))}>← Back</button>
        ) : (
          <span className="name-panel-label">Name</span>
        )}
        <button className="icon-btn" onClick={onClose} aria-label="Close name details">✕</button>
      </div>
      <div className="name-panel-body">
        {!entries && <p className="muted">Loading…</p>}
        {entries?.length === 0 && <p className="muted">No details found for this name.</p>}
        {entries?.map((e, i) => (
          <Entry key={e.id + i} entry={e} nt={nt} onPick={(ids) => setStack((s) => [...s, ids])} onOpen={onOpen} />
        ))}
        <p className="attribution">
          Names, original forms and meanings from{' '}
          <a href="https://github.com/STEPBible/STEPBible-Data" target="_blank" rel="noreferrer">STEPBible.org</a>{' '}
          (Tyndale House Cambridge), CC BY 4.0.
        </p>
      </div>
    </aside>
  )
}

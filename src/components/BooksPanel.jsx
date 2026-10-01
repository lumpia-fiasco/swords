import { useEffect, useRef, useState } from 'react'
import { BOOKS } from '../books.js'

const SHELVES = [
  ['OT', 'Old Testament'],
  ['NT', 'New Testament'],
  ['EXTRA', 'Other writings'],
]

export default function BooksPanel({ focus, onNavigate }) {
  // The book whose chapters are showing; starts on the one being read.
  const [open, setOpen] = useState(focus.book)
  const currentRef = useRef(null)

  useEffect(() => setOpen(focus.book), [focus.book])
  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'nearest' })
  }, [])

  return (
    <div className="books">
      {SHELVES.map(([t, title]) => (
        <section key={t} className="shelf">
          <h3>{title}</h3>
          <ul className="book-list">
            {BOOKS.filter((b) => b.testament === t).map((b) => {
              const isOpen = open === b.id
              const isCurrent = focus.book === b.id
              return (
                <li key={b.id} ref={isCurrent ? currentRef : null}>
                  <button
                    className={`book-btn ${isOpen ? 'open' : ''} ${isCurrent ? 'current' : ''}`}
                    aria-expanded={isOpen}
                    onClick={() => (b.chapters === 1 ? onNavigate({ book: b.id, chapter: 1 }) : setOpen(isOpen ? null : b.id))}
                  >
                    <span>{b.name}</span>
                    <span className="book-ch">{b.chapters === 1 ? '1 chapter' : `${b.chapters}`}</span>
                  </button>
                  {isOpen && b.chapters > 1 && (
                    <div className="chapter-grid" role="group" aria-label={`${b.name} chapters`}>
                      {Array.from({ length: b.chapters }, (_, i) => i + 1).map((ch) => (
                        <button
                          key={ch}
                          className={`ch-btn ${isCurrent && focus.chapter === ch ? 'on' : ''}`}
                          aria-current={isCurrent && focus.chapter === ch ? 'page' : undefined}
                          onClick={() => onNavigate({ book: b.id, chapter: ch })}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}

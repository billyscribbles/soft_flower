import { Plus, Check } from 'lucide-react'
import { addons } from '../content/addons.js'
import { useCart } from '../context/CartContext.jsx'
import './AddOns.css'

function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0
}

export default function AddOns({
  selected = [],
  notes = {},
  onToggle,
  onNoteChange,
}) {
  const { addItem } = useCart()

  const handleAddCard = () => {
    const card = addons.cardOnly
    addItem(
      {
        slug: `addon-${card.slug}`,
        name: card.name,
        price: card.price,
        image: card.image,
      },
      1,
    )
  }

  return (
    <section className="addons">
      <div className="addons__head">
        {addons.eyebrow && (
          <span className="addons__eyebrow">{addons.eyebrow}</span>
        )}
        <h3 className="addons__heading">{addons.heading}</h3>
      </div>

      <div className="addons__list">
        {addons.items.map((item) => {
          const isSelected = selected.includes(item.slug)
          const noteValue = notes[item.slug] || ''
          const wordCount = item.noteable ? countWords(noteValue) : 0
          const overLimit =
            item.noteable && item.noteMaxWords && wordCount > item.noteMaxWords
          return (
            <div key={item.slug} className="addons__item-wrap">
              <button
                type="button"
                className={`addons__item${isSelected ? ' addons__item--on' : ''}`}
                onClick={() => onToggle?.(item.slug)}
                aria-pressed={isSelected}
              >
                <div className="addons__item-text">
                  <div className="addons__item-name">
                    {item.name}
                    {item.free && <span className="addons__item-free">Free</span>}
                  </div>
                  <div className="addons__item-blurb">{item.blurb}</div>
                </div>
                <div className="addons__item-meta">
                  <span className="addons__item-price">
                    {item.price > 0 ? `+$${item.price}` : 'Included'}
                  </span>
                  <span className="addons__item-icon" aria-hidden="true">
                    {isSelected ? (
                      <Check size={16} strokeWidth={2} />
                    ) : (
                      <Plus size={16} strokeWidth={2} />
                    )}
                  </span>
                </div>
              </button>

              {item.noteable && isSelected && (
                <div className="addons__note">
                  <textarea
                    className="addons__note-input"
                    rows="3"
                    value={noteValue}
                    placeholder={item.notePlaceholder}
                    onChange={(e) => onNoteChange?.(item.slug, e.target.value)}
                  />
                  <div
                    className={`addons__note-counter${overLimit ? ' addons__note-counter--over' : ''}`}
                  >
                    {wordCount} / {item.noteMaxWords} words
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {addons.cardOnly && (
        <button
          type="button"
          className="addons__card-cta"
          onClick={handleAddCard}
        >
          {addons.cardOnly.ctaText}
        </button>
      )}
    </section>
  )
}

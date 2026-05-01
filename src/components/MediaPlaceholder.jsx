import './MediaPlaceholder.css'

export default function MediaPlaceholder({ label = 'Photo coming soon' }) {
  const showLabel = Boolean(label)
  return (
    <div
      className="media-placeholder"
      role="img"
      aria-label={showLabel ? label : 'Photo placeholder'}
    >
      {showLabel && <span className="media-placeholder__label">{label}</span>}
    </div>
  )
}

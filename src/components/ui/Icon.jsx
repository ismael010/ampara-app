export default function Icon({ name, size = 24, className = '' }) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: "'FILL' 0, 'wght' 400",
        fontFeatureSettings: "'liga'",
        WebkitFontFeatureSettings: "'liga'",
        WebkitFontSmoothing: 'antialiased',
        display: 'inline-block',
        lineHeight: 1,
      }}
    >
      {name}
    </span>
  )
}
export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'rounded-button py-3 text-sm font-semibold transition disabled:opacity-40'

  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'text-primary-600 hover:opacity-70',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}
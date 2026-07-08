import TopNav from './TopNav'

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-brand-50">
      {/* TopNav solo en desktop */}
      <TopNav />

      {/* Contenido: en desktop centrado con max-width */}
      <main className="md:max-w-5xl md:mx-auto md:px-6 md:py-6">
        {children}
      </main>
    </div>
  )
}
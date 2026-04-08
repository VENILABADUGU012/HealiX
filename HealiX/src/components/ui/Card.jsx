function Card({ title, action, children, className = '' }) {
  return (
    <section
      className={`rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700 ${className}`}
    >
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between">
          {title ? <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{title}</h3> : <span />}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}

export default Card

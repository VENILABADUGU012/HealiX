function PageHeader({ title, subtitle, rightSlot }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
        {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p> : null}
      </div>
      {rightSlot}
    </div>
  )
}

export default PageHeader

function Input({ label, className = '', ...props }) {
  return (
    <label className="flex w-full flex-col gap-1">
      {label && <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>}
      <input
        className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900/40 ${className}`}
        {...props}
      />
    </label>
  )
}

export default Input

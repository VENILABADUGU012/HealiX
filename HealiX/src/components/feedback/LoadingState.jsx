function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center gap-3 text-slate-600">
        <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
        <span className="text-sm">{label}</span>
      </div>
    </div>
  )
}

export default LoadingState

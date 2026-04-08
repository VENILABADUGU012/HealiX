import useNotifications from '../../hooks/useNotifications'

function ToastStack() {
  const { toasts } = useNotifications()

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`min-w-64 rounded-xl px-4 py-3 text-sm shadow-lg ${
            toast.type === 'warning' ? 'bg-amber-100 text-amber-900' : 'bg-slate-900 text-white'
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}

export default ToastStack

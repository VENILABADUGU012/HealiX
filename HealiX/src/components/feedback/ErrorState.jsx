import Button from '../ui/Button'

function ErrorState({ message = 'Unable to load this section.', onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <p className="text-sm">{message}</p>
      {onRetry && (
        <Button className="mt-3" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorState

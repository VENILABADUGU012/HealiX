import Card from '../ui/Card'

function RemediesFeed({ remedies }) {
  return (
    <Card title="Remedies Feed" className="h-full">
      <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
        {remedies.map((remedy) => (
          <article key={remedy.id} className="rounded-xl bg-gradient-to-r from-blue-50 to-emerald-50 p-3">
            <h4 className="text-sm font-semibold text-slate-800">{remedy.title}</h4>
            <p className="text-xs text-slate-600">{remedy.text}</p>
          </article>
        ))}
      </div>
    </Card>
  )
}

export default RemediesFeed

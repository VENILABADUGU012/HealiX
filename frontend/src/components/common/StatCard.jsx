import Card from '../ui/Card'

function StatCard({ title, value, accent = 'text-slate-800' }) {
  return (
    <Card title={title}>
      <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    </Card>
  )
}

export default StatCard

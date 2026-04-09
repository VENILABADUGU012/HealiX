import Card from '../ui/Card'

function HealthEvents() {
  return (
    <Card title="Health Events">
      <div className="space-y-2 text-sm text-slate-600">
        <div className="rounded-xl border border-slate-200 p-2">Annual Checkup - April 2</div>
        <div className="rounded-xl border border-slate-200 p-2">Vaccination Reminder - April 8</div>
        <div className="rounded-xl border border-slate-200 p-2">Lab Test Follow-up - April 10</div>
      </div>
    </Card>
  )
}

export default HealthEvents

import Card from '../ui/Card'
import Badge from '../ui/Badge'

function MedicineTracker({ schedule }) {
  return (
    <Card title="Medicine Tracker">
      <div className="space-y-2">
        {schedule.map((medicine) => (
          <div key={medicine.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-2">
            <div>
              <p className="text-sm font-medium text-slate-700">{medicine.name}</p>
              <p className="text-xs text-slate-500">{medicine.time}</p>
            </div>
            <Badge tone={medicine.status === 'Taken' ? 'success' : 'warning'}>
              {medicine.status}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default MedicineTracker

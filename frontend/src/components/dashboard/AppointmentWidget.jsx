import Card from '../ui/Card'
import Badge from '../ui/Badge'

function AppointmentWidget({ appointments }) {
  return (
    <Card title="Upcoming Appointments">
      <div className="space-y-3">
        {appointments.slice(0, 2).map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-3">
            <div className="mb-1 flex items-center justify-between">
              <p className="font-medium text-slate-800">{item.doctor}</p>
              <Badge tone="info">{item.mode}</Badge>
            </div>
            {item.hospital ? <p className="text-sm text-slate-500">{item.hospital}</p> : null}
            <p className="text-sm text-slate-600">{item.specialty}</p>
            <p className="text-sm text-slate-500">{item.date} at {item.time}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default AppointmentWidget

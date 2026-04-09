import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { APPOINTMENTS_EVENT, loadAppointments } from '../utils/bookingStorage'

function BookingHistory() {
  const navigate = useNavigate()
  const [list, setList] = useState([])

  useEffect(() => {
    const load = () => {
      const all = loadAppointments()
      setList(all.filter((a) => a.status === 'Completed' || a.status === 'Cancelled'))
    }
    load()
    window.addEventListener(APPOINTMENTS_EVENT, load)
    return () => window.removeEventListener(APPOINTMENTS_EVENT, load)
  }, [])

  return (
    <div className="space-y-4">
      <PageHeader
        title="Appointment history"
        subtitle="Completed and cancelled visits"
        rightSlot={<Button variant="outline" onClick={() => navigate('/booking')}>Back to Booking</Button>}
      />
      <Card>
        {list.length === 0 ? (
          <p className="text-sm text-slate-500">No history yet.</p>
        ) : (
          <div className="max-h-[70vh] space-y-3 overflow-y-auto">
            {list.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-4 transition-all duration-300 hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800">{a.doctor}</p>
                    <p className="text-sm text-slate-600">{a.hospital}</p>
                    <p className="text-sm text-slate-500">{a.date} · {a.time}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge tone={a.mode === 'Online' ? 'info' : 'default'}>{a.mode}</Badge>
                    <Badge tone={a.status === 'Completed' ? 'success' : 'warning'}>{a.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

export default BookingHistory

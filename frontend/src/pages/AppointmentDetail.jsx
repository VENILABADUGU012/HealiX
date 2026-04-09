import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Modal from '../components/ui/Modal'
import { APPOINTMENTS_EVENT, loadAppointments } from '../utils/bookingStorage'
import { buildClinicalNotes } from '../utils/clinicalNotes'
import { resolveDoctorIdFromAppointment } from '../data/bookingData'

function downloadBlob(filename, mime, textBody) {
  const blob = new Blob([textBody], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

function AppointmentDetail() {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const [videoOpen, setVideoOpen] = useState(false)

  const [appointment, setAppointment] = useState(null)

  useEffect(() => {
    const load = () => setAppointment(loadAppointments().find((a) => a.id === appointmentId) || null)
    load()
    window.addEventListener(APPOINTMENTS_EVENT, load)
    return () => window.removeEventListener(APPOINTMENTS_EVENT, load)
  }, [appointmentId])

  const notes = appointment ? buildClinicalNotes(appointment) : null
  const doctorProfileId = appointment ? resolveDoctorIdFromAppointment(appointment) : undefined

  if (!appointment) {
    return (
      <div className="space-y-4">
        <PageHeader title="Appointment not found" />
        <Button onClick={() => navigate('/booking')}>Back to Booking</Button>
      </div>
    )
  }

  const isOnline = appointment.mode === 'Online'

  return (
    <div className="space-y-6">
      <PageHeader
        title={appointment.doctor}
        subtitle={`${appointment.hospital} · ${appointment.date} ${appointment.time}`}
        rightSlot={<Button variant="outline" onClick={() => navigate('/booking')}>Back</Button>}
      />

      <div className="flex flex-wrap gap-2">
        <Badge tone={isOnline ? 'info' : 'default'}>{appointment.mode}</Badge>
        <Badge tone="success">{appointment.status}</Badge>
      </div>

      <Card title="Doctor notes">
        <div className="space-y-3 text-sm text-slate-600">
          <div>
            <p className="font-medium text-slate-800">Diagnosis</p>
            <p>{notes?.diagnosis}</p>
          </div>
          <div>
            <p className="font-medium text-slate-800">Suggestions</p>
            <ul className="list-disc pl-5">
              {notes?.suggestions.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-medium text-slate-800">Prescription notes</p>
            <p>{notes?.prescriptionNotes}</p>
          </div>
        </div>
      </Card>

      <Card title="Documents">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              downloadBlob(
                `HealiX-prescription-${appointment.id}.pdf`,
                'application/pdf',
                `%PDF-1.4\nHealiX Prescription\nPatient copy\n${notes?.prescriptionNotes || ''}\n`,
              )
            }
          >
            Download prescription (PDF)
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              downloadBlob(
                `HealiX-consult-${appointment.id}.pdf`,
                'application/pdf',
                `%PDF-1.4\nHealiX Consultation Report\n\nDoctor: ${appointment.doctor}\n${notes?.diagnosis}\n`,
              )
            }
          >
            Download consultation report (PDF)
          </Button>
        </div>
      </Card>

      {isOnline && (
        <Card title="Video consultation">
          <div className="relative">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-900 text-white shadow-md">
              <div className="text-center">
                <p className="text-sm text-slate-300">Camera preview (mock)</p>
                <p className="mt-2 text-lg font-semibold">{appointment.doctor}</p>
              </div>
            </div>
            <Button className="mt-3 w-full" onClick={() => setVideoOpen(true)}>
              Start Video Call
            </Button>
          </div>
        </Card>
      )}

      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onClick={() =>
            navigate('/messages', {
              state: {
                openDoctorChat: {
                  doctorId: doctorProfileId ?? appointment.doctorId,
                  name: appointment.doctor,
                  hospital: appointment.hospital,
                },
              },
            })
          }
        >
          Message Doctor
        </Button>
        <Button disabled={!doctorProfileId} onClick={() => doctorProfileId && navigate(`/booking/doctor/${doctorProfileId}`)}>
          Doctor profile
        </Button>
      </div>

      <Modal open={videoOpen} title="Video call" onClose={() => setVideoOpen(false)}>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-800 text-xs text-white">
              You
            </div>
            <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-700 text-sm text-white">
              {appointment.doctor}
            </div>
          </div>
          <Button className="w-full" onClick={() => setVideoOpen(false)}>
            End call
          </Button>
        </div>
      </Modal>
    </div>
  )
}

export default AppointmentDetail

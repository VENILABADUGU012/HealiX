import Card from '../ui/Card'

function DoctorNotes() {
  return (
    <Card title="Doctor Notes">
      <ul className="space-y-2 text-sm text-slate-600">
        <li className="rounded-xl bg-slate-50 p-2">Continue anti-allergy medication for 5 days.</li>
        <li className="rounded-xl bg-slate-50 p-2">Avoid processed sugar and sleep before 11 PM.</li>
        <li className="rounded-xl bg-slate-50 p-2">Review blood panel in next follow-up.</li>
      </ul>
    </Card>
  )
}

export default DoctorNotes

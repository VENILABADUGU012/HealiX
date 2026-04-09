function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i += 1) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function buildClinicalNotes(apt) {
  const h = hashStr(`${apt.id}-${apt.doctor}`)
  const dx = [
    'Stable chronic condition with good symptom control.',
    'Acute presentation — monitoring recommended.',
    'Preventive visit — no acute findings.',
  ]
  const sug = [
    ['Continue current medications', 'Diet: low processed sugar', 'Follow-up in 4 weeks'],
    ['Rest 48h', 'Hydration', 'Return if fever > 101°F'],
    ['Annual labs', 'BP log twice weekly', 'Cardio walk 150 min/week'],
  ]
  const rx = [
    'Rx: Paracetamol 500mg SOS | Antihistamine 10mg nightly x7d',
    'Rx: Vitamin D3 60k weekly x8w | Omega-3 1g morning x30d',
    'Rx: PPI 40mg morning before breakfast x14d',
  ]
  const i = h % 3
  return {
    diagnosis: dx[i],
    suggestions: sug[i],
    prescriptionNotes: rx[i],
  }
}

/** Parse prescription lines from mock clinical notes for Personal Health */
export function extractMedicationsFromAppointment(apt) {
  const notes = buildClinicalNotes(apt)
  const raw = (notes.prescriptionNotes || '').replace(/^Rx:\s*/i, '')
  const parts = raw.split('|').map((s) => s.trim()).filter(Boolean)
  return parts.map((p, idx) => {
    const durationMatch = p.match(/x(\d+)\s*w/i)
    const daysMatch = p.match(/x(\d+)\s*d/i)
    let durationDays = 7
    if (daysMatch) durationDays = parseInt(daysMatch[1], 10)
    else if (durationMatch) durationDays = parseInt(durationMatch[1], 10) * 7
    const name = p
      .replace(/\s+x\d+\s*[dw]/gi, '')
      .replace(/\s+SOS$/i, '')
      .trim()
    let timing = 'Daily'
    if (/nightly|night|evening|pm\b/i.test(p)) timing = 'Evening'
    else if (/morning|breakfast|AM\b/i.test(p)) timing = 'Morning'
    else if (/SOS/i.test(p)) timing = 'As needed'
    return {
      id: `${apt.id}-rx-${idx}`,
      name: name || `Medication ${idx + 1}`,
      timing,
      durationDays,
      appointmentId: apt.id,
      doctor: apt.doctor,
    }
  })
}

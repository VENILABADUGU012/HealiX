/** Lightweight keyword → Booking / Pharmacy hints (local only). */
export const symptomSuggestions = [
  {
    keyword: 'headache',
    doctors: ['Neurologist'],
    medicines: ['Paracetamol'],
  },
  {
    keyword: 'fever',
    doctors: ['General Physician'],
    medicines: ['Crocin'],
  },
  {
    keyword: 'skin',
    doctors: ['Dermatologist'],
    medicines: ['Moisturizer', 'Sunscreen'],
  },
  {
    keyword: 'hair',
    doctors: ['Dermatologist'],
    medicines: ['Hair care supplements'],
  },
]

export function getLiveSearchSuggestions(query) {
  const lower = query.toLowerCase().trim()
  if (!lower) return { doctors: [], medicines: [] }
  const doctors = new Set()
  const medicines = new Set()
  symptomSuggestions.forEach((row) => {
    if (lower.includes(row.keyword)) {
      row.doctors.forEach((d) => doctors.add(d))
      row.medicines.forEach((m) => medicines.add(m))
    }
  })
  return { doctors: [...doctors], medicines: [...medicines] }
}

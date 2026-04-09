export const appointments = [
  { id: 1, doctor: 'Dr. Priya Sharma', specialty: 'Dermatology', date: '2026-03-25', time: '10:30 AM', mode: 'In-person', hospital: 'Aster Prime Hospital' },
  { id: 2, doctor: 'Dr. Arjun Rao', specialty: 'Cardiology', date: '2026-03-27', time: '04:00 PM', mode: 'Video', hospital: 'City Care Heart Center' },
  { id: 3, doctor: 'Dr. Nikhil Das', specialty: 'ENT', date: '2026-03-30', time: '12:00 PM', mode: 'In-person', hospital: 'Metro Health Clinic' },
]

export const hospitals = [
  { id: 1, name: 'Aster Prime Hospital', distance: 1.8, rating: 4.7, location: 'Indiranagar, Bengaluru' },
  { id: 2, name: 'City Care Heart Center', distance: 3.1, rating: 4.8, location: 'Koramangala, Bengaluru' },
  { id: 3, name: 'Metro Health Clinic', distance: 2.4, rating: 4.5, location: 'HSR Layout, Bengaluru' },
]

export const doctors = [
  {
    id: 1,
    name: 'Dr. Priya Sharma',
    specialty: 'Dermatologist',
    experience: '11 years',
    price: 750,
    about: 'Focuses on acne, eczema, and skin allergy management with lifestyle-first plans.',
    reviews: ['Very patient and explains every step.', 'Skin improved significantly in 3 weeks.'],
    slots: ['10:30 AM', '11:00 AM', '05:30 PM', '06:00 PM'],
  },
  {
    id: 2,
    name: 'Dr. Arjun Rao',
    specialty: 'Cardiologist',
    experience: '14 years',
    price: 1200,
    about: 'Specializes in preventive cardiology and hypertension risk management.',
    reviews: ['Helpful for long-term heart health plan.', 'Detailed diagnosis and clear next actions.'],
    slots: ['09:00 AM', '09:30 AM', '04:00 PM'],
  },
]

export const medicines = [
  { id: 1, name: 'Paracetamol 650', category: 'Fever', price: 49, stock: 'In Stock' },
  { id: 2, name: 'Cetirizine 10mg', category: 'Cold', price: 72, stock: 'In Stock' },
  { id: 3, name: 'BalmX Roll-on', category: 'Headache', price: 89, stock: 'Low Stock' },
  { id: 4, name: 'Tulsi Immunity Mix', category: 'Ayurvedic', price: 149, stock: 'In Stock' },
]

export const remedies = [
  { id: 1, title: 'Hydration Boost', text: 'Drink 2.5L water daily and add oral rehydration in hot weather.' },
  { id: 2, title: 'Sore Throat Relief', text: 'Warm saline gargle twice daily and avoid cold beverages.' },
  { id: 3, title: 'Desk Pain Prevention', text: 'Stretch neck and shoulders every 45 mins to reduce stiffness.' },
]

export const healthMetrics = {
  steps: 8234,
  sleepHours: 7.2,
  waterLitres: 2.1,
  healthScore: 82,
  streakDays: 6,
}

export const messages = [
  { id: 1, from: 'Dr. Priya Sharma', channel: 'Doctors', text: 'Please continue serum for 7 more days.', time: '09:40 AM' },
  { id: 2, from: 'HealiX Pharmacy', channel: 'Pharmacy', text: 'Your order #HX342 is out for delivery.', time: '11:10 AM' },
  { id: 3, from: 'Support Team', channel: 'Support', text: 'Your insurance query has been resolved.', time: 'Yesterday' },
]

export const habitItems = [
  { id: 1, name: 'Morning Walk', streak: 9, completed: true },
  { id: 2, name: 'Meditation', streak: 4, completed: false },
  { id: 3, name: 'No Sugar', streak: 6, completed: true },
]

export const medicineSchedule = [
  { id: 1, name: 'Vitamin D3', time: '08:00 AM', status: 'Taken' },
  { id: 2, name: 'Omega 3', time: '02:00 PM', status: 'Pending' },
  { id: 3, name: 'Magnesium', time: '09:00 PM', status: 'Pending' },
]

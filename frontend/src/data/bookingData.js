import { doctorImages, hospitalImages } from './healthMediaUrls'

/** Rich dataset for Booking module — hospitals, doctors, carousel recommendations */

const nh = hospitalImages.length
const nd = doctorImages.length
const hAt = (i) => hospitalImages[((i - 1) % nh + nh) % nh]
const dAt = (i) => doctorImages[((i - 1) % nd + nd) % nd]

export const recommendationSlides = [
  {
    id: 'consult',
    title: 'Best hospitals for consultation',
    description: 'Top-rated multispecialty care near you',
    detailBody:
      'Explore trusted hospitals for general and specialist consultations. HealiX matches you with accredited centers, transparent pricing, and same-week availability across Bengaluru.',
    filterTags: ['consultation', 'general', 'multispecialty'],
    image: hAt(1),
    reviews: ['Found a great GP in 10 minutes.', 'Clear ratings helped me choose.', 'Booking was seamless.'],
  },
  {
    id: 'mental',
    title: 'Mental health therapy',
    description: 'Licensed therapists and psychiatrists',
    detailBody:
      'Confidential therapy and psychiatry with evidence-based protocols. Choose video or in-person sessions with verified mental health professionals.',
    filterTags: ['therapy', 'mental', 'psychiatry'],
    image: dAt(2),
    reviews: ['Therapist was empathetic and structured.', 'CBT plan actually worked.', 'Easy to reschedule.'],
  },
  {
    id: 'yoga',
    title: 'Yoga sessions',
    description: 'Guided wellness and physiotherapy yoga',
    detailBody:
      'Therapeutic yoga led by physiotherapists—ideal for posture, mobility, and stress. Small groups and 1:1 options near you.',
    filterTags: ['yoga', 'wellness', 'physiotherapy'],
    image: hAt(3),
    reviews: ['Fixed my lower back stiffness.', 'Instructors know clinical limits.', 'Calm studio environment.'],
  },
  {
    id: 'checkup',
    title: 'Health checkup packages',
    description: 'Full body and executive health screens',
    detailBody:
      'Comprehensive labs, cardiac risk scores, and imaging bundles. Digital reports with doctor interpretation within 48 hours.',
    filterTags: ['checkup', 'cardiac', 'lab'],
    image: hAt(4),
    reviews: ['Executive package saved me a second visit.', 'Nurse home sample was punctual.', 'Reports in the app instantly.'],
  },
]

export const bookingHospitals = [
  { id: 1, name: 'Aster Prime Hospital', image: hAt(1), location: 'Indiranagar, Bengaluru', distance: 1.2, rating: 4.8, reviewCount: 1240 },
  { id: 2, name: 'City Care Heart Center', image: hAt(2), location: 'Koramangala, Bengaluru', distance: 2.1, rating: 4.7, reviewCount: 892 },
  { id: 3, name: 'Metro Health Clinic', image: hAt(3), location: 'HSR Layout, Bengaluru', distance: 3.4, rating: 4.5, reviewCount: 560 },
  { id: 4, name: 'Zenith Multispecialty', image: hAt(4), location: 'Whitefield, Bengaluru', distance: 4.2, rating: 4.6, reviewCount: 720 },
  { id: 5, name: 'MindWell Psychiatry Center', image: hAt(5), location: 'Jayanagar, Bengaluru', distance: 2.8, rating: 4.9, reviewCount: 410 },
  { id: 6, name: 'Heal Yoga & Physio Studio', image: hAt(6), location: 'Indiranagar, Bengaluru', distance: 1.5, rating: 4.4, reviewCount: 330 },
  { id: 7, name: 'LifeLine Diagnostics Hub', image: hAt(7), location: 'Electronic City', distance: 5.1, rating: 4.3, reviewCount: 980 },
  { id: 8, name: 'Kids First Pediatric', image: hAt(8), location: 'Malleshwaram', distance: 3.9, rating: 4.8, reviewCount: 650 },
  { id: 9, name: 'SkinGlow Dermatology Institute', image: hAt(9), location: 'MG Road', distance: 2.4, rating: 4.6, reviewCount: 520 },
  { id: 10, name: 'ENT & Voice Care Clinic', image: hAt(10), location: 'RT Nagar', distance: 4.0, rating: 4.5, reviewCount: 280 },
  { id: 11, name: 'OrthoMotion Sports Med', image: hAt(11), location: 'Kalyan Nagar', distance: 3.2, rating: 4.7, reviewCount: 440 },
  { id: 12, name: 'Women’s Wellness Center', image: hAt(12), location: 'Ulsoor', distance: 2.6, rating: 4.8, reviewCount: 590 },
]

const slotsAm = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM']
const slotsPm = ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']

const coreBookingDoctors = [
  { id: 1, name: 'Dr. Priya Sharma', specialization: 'Dermatology', hospitalId: 9, diseases: ['acne', 'eczema', 'psoriasis'], rating: 4.8, reviewCount: 312, fee: 750, mode: 'Both', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop', about: 'Skin allergy and cosmetic dermatology.', reviews: ['Excellent bedside manner.', 'Clear treatment plan.'], phone: '+91 98765 11101', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 2, name: 'Dr. Arjun Rao', specialization: 'Cardiology', hospitalId: 2, diseases: ['hypertension', 'chest pain', 'cholesterol'], rating: 4.9, reviewCount: 520, fee: 1200, mode: 'Offline', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop', about: 'Preventive cardiology specialist.', reviews: ['Thorough cardiac workup.', 'Very reassuring.'], phone: '+91 98765 11102', slotsOnline: [], slotsOffline: [...slotsAm, ...slotsPm] },
  { id: 3, name: 'Dr. Nikhil Das', specialization: 'ENT', hospitalId: 10, diseases: ['sinusitis', 'hearing', 'throat'], rating: 4.6, reviewCount: 198, fee: 650, mode: 'Both', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=160&h=160&fit=crop', about: 'ENT surgery and allergies.', reviews: ['Fixed my chronic sinus issue.'], phone: '+91 98765 11103', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 4, name: 'Dr. Meera Iyer', specialization: 'Pediatrics', hospitalId: 8, diseases: ['fever', 'vaccination', 'growth'], rating: 4.9, reviewCount: 640, fee: 600, mode: 'Offline', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop', about: 'Child wellness and nutrition.', reviews: ['Kids love her.'], phone: '+91 98765 11104', slotsOnline: [], slotsOffline: slotsAm },
  { id: 5, name: 'Dr. Sanjay Verma', specialization: 'Orthopedics', hospitalId: 11, diseases: ['knee pain', 'sports injury', 'arthritis'], rating: 4.7, reviewCount: 410, fee: 900, mode: 'Both', image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=160&h=160&fit=crop', about: 'Sports medicine and joint care.', reviews: ['Back to running in weeks.'], phone: '+91 98765 11105', slotsOnline: ['05:00 PM', '06:00 PM'], slotsOffline: slotsAm },
  { id: 6, name: 'Dr. Ananya Reddy', specialization: 'Gynecology', hospitalId: 12, diseases: ['prenatal', 'PCOS', 'wellness'], rating: 4.8, reviewCount: 380, fee: 850, mode: 'Offline', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&h=160&fit=crop', about: 'Women’s health and fertility support.', reviews: ['Compassionate care.'], phone: '+91 98765 11106', slotsOnline: [], slotsOffline: [...slotsAm, ...slotsPm] },
  { id: 7, name: 'Dr. Rahul Menon', specialization: 'General Medicine', hospitalId: 1, diseases: ['fever', 'diabetes', 'checkup'], rating: 4.5, reviewCount: 890, fee: 500, mode: 'Both', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=160&h=160&fit=crop', about: 'Primary care and chronic disease.', reviews: ['Always available for follow-ups.'], phone: '+91 98765 11107', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 8, name: 'Dr. Kavitha Nair', specialization: 'Psychiatry', hospitalId: 5, diseases: ['anxiety', 'depression', 'therapy'], rating: 4.9, reviewCount: 275, fee: 1100, mode: 'Online', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop', about: 'CBT and medication management.', reviews: ['Life-changing sessions.'], phone: '+91 98765 11108', slotsOnline: [...slotsAm, ...slotsPm], slotsOffline: [] },
  { id: 9, name: 'Dr. Vikram Singh', specialization: 'Physiotherapy', hospitalId: 6, diseases: ['yoga', 'back pain', 'rehab'], rating: 4.4, reviewCount: 220, fee: 450, mode: 'Both', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop', about: 'Yoga-informed physiotherapy.', reviews: ['Great for desk workers.'], phone: '+91 98765 11109', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 10, name: 'Dr. Deepa Krishnan', specialization: 'Endocrinology', hospitalId: 4, diseases: ['thyroid', 'diabetes', 'hormone'], rating: 4.7, reviewCount: 340, fee: 950, mode: 'Offline', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop', about: 'Thyroid and metabolic disorders.', reviews: ['Detailed lab review.'], phone: '+91 98765 11110', slotsOnline: [], slotsOffline: slotsPm },
  { id: 11, name: 'Dr. Imran Khan', specialization: 'Pulmonology', hospitalId: 3, diseases: ['asthma', 'COPD', 'allergy'], rating: 4.6, reviewCount: 290, fee: 800, mode: 'Both', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=160&h=160&fit=crop', about: 'Lung health and sleep apnea.', reviews: ['Clear explanations.'], phone: '+91 98765 11111', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 12, name: 'Dr. Lisa George', specialization: 'Ophthalmology', hospitalId: 1, diseases: ['vision', 'cataract', 'dry eye'], rating: 4.8, reviewCount: 410, fee: 700, mode: 'Offline', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&h=160&fit=crop', about: 'Comprehensive eye exams.', reviews: ['Best LASIK consult.'], phone: '+91 98765 11112', slotsOnline: [], slotsOffline: slotsAm },
  { id: 13, name: 'Dr. Manoj Pillai', specialization: 'Gastroenterology', hospitalId: 4, diseases: ['IBS', 'liver', 'GERD'], rating: 4.5, reviewCount: 360, fee: 1000, mode: 'Both', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=160&h=160&fit=crop', about: 'Digestive health specialist.', reviews: ['Endoscopy was smooth.'], phone: '+91 98765 11113', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 14, name: 'Dr. Sneha Patil', specialization: 'Dermatology', hospitalId: 9, diseases: ['hair loss', 'acne'], rating: 4.7, reviewCount: 180, fee: 680, mode: 'Online', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop', about: 'Trichology and medical peels.', reviews: ['Visible results in 6 weeks.'], phone: '+91 98765 11114', slotsOnline: slotsPm, slotsOffline: [] },
  { id: 15, name: 'Dr. Karthik Bose', specialization: 'Neurology', hospitalId: 1, diseases: ['migraine', 'seizure', 'vertigo'], rating: 4.8, reviewCount: 295, fee: 1300, mode: 'Offline', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop', about: 'Headache and movement disorders.', reviews: ['Finally diagnosed my migraines.'], phone: '+91 98765 11115', slotsOnline: [], slotsOffline: [...slotsAm, ...slotsPm] },
  { id: 16, name: 'Dr. Fatima Noor', specialization: 'Rheumatology', hospitalId: 3, diseases: ['arthritis', 'lupus', 'joint pain'], rating: 4.6, reviewCount: 150, fee: 920, mode: 'Both', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop', about: 'Autoimmune disease management.', reviews: ['Very thorough.'], phone: '+91 98765 11116', slotsOnline: slotsPm, slotsOffline: slotsAm },
  { id: 17, name: 'Dr. Rohit Malhotra', specialization: 'Urology', hospitalId: 2, diseases: ['kidney', 'UTI', 'prostate'], rating: 4.5, reviewCount: 210, fee: 880, mode: 'Offline', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=160&h=160&fit=crop', about: 'Minimally invasive procedures.', reviews: ['Professional team.'], phone: '+91 98765 11117', slotsOnline: [], slotsOffline: slotsPm },
  { id: 18, name: 'Dr. Elena Joseph', specialization: 'Oncology', hospitalId: 4, diseases: ['cancer screening', 'chemo consult'], rating: 4.9, reviewCount: 190, fee: 1500, mode: 'Both', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&h=160&fit=crop', about: 'Compassionate oncology care.', reviews: ['Supported our family through treatment.'], phone: '+91 98765 11118', slotsOnline: ['10:00 AM', '11:00 AM'], slotsOffline: slotsPm },
  { id: 19, name: 'Dr. Aditya Ghosh', specialization: 'Nephrology', hospitalId: 7, diseases: ['kidney disease', 'dialysis'], rating: 4.7, reviewCount: 240, fee: 1050, mode: 'Offline', image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=160&h=160&fit=crop', about: 'CKD and transplant workup.', reviews: ['Explains GFR clearly.'], phone: '+91 98765 11119', slotsOnline: [], slotsOffline: slotsAm },
  { id: 20, name: 'Dr. Pooja Sethi', specialization: 'Nutrition', hospitalId: 6, diseases: ['weight', 'diabetes diet', 'wellness'], rating: 4.4, reviewCount: 410, fee: 400, mode: 'Online', image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=160&h=160&fit=crop', about: 'Clinical diet plans.', reviews: ['Sustainable meal plans.'], phone: '+91 98765 11120', slotsOnline: [...slotsAm, ...slotsPm], slotsOffline: [] },
  { id: 21, name: 'Dr. Harish Kulkarni', specialization: 'General Surgery', hospitalId: 1, diseases: ['hernia', 'gallbladder'], rating: 4.6, reviewCount: 330, fee: 1100, mode: 'Offline', image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=160&h=160&fit=crop', about: 'Laparoscopic surgery.', reviews: ['Quick recovery.'], phone: '+91 98765 11121', slotsOnline: [], slotsOffline: slotsPm },
  { id: 22, name: 'Dr. Nandini Rao', specialization: 'Psychology', hospitalId: 5, diseases: ['therapy', 'stress', 'CBT'], rating: 4.8, reviewCount: 520, fee: 800, mode: 'Online', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=160&h=160&fit=crop', about: 'Licensed clinical psychologist.', reviews: ['Safe space to talk.'], phone: '+91 98765 11122', slotsOnline: slotsPm, slotsOffline: [] },
  { id: 23, name: 'Dr. Suresh Babu', specialization: 'Radiology', hospitalId: 7, diseases: ['MRI', 'imaging', 'checkup'], rating: 4.3, reviewCount: 120, fee: 600, mode: 'Offline', image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=160&h=160&fit=crop', about: 'Diagnostic imaging reads.', reviews: ['Fast report turnaround.'], phone: '+91 98765 11123', slotsOnline: [], slotsOffline: slotsAm },
  { id: 24, name: 'Dr. Anita Desai', specialization: 'Internal Medicine', hospitalId: 3, diseases: ['checkup', 'fever', 'consultation'], rating: 4.5, reviewCount: 670, fee: 550, mode: 'Both', image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=160&h=160&fit=crop', about: 'Executive health programs.', reviews: ['Great for annual physical.'], phone: '+91 98765 11124', slotsOnline: slotsPm, slotsOffline: slotsAm },
]

const SPEC_ROWS = [
  ['Dermatology', ['acne', 'rash', 'cosmetic'], 720, 'Both'],
  ['Cardiology', ['BP', 'ECG', 'cholesterol'], 1150, 'Offline'],
  ['ENT', ['sinus', 'allergy', 'voice'], 680, 'Both'],
  ['Pediatrics', ['vaccines', 'growth', 'fever'], 620, 'Offline'],
  ['Orthopedics', ['knee', 'spine', 'sports'], 920, 'Both'],
  ['Gynecology', ['PCOS', 'prenatal', 'wellness'], 880, 'Offline'],
  ['Psychiatry', ['anxiety', 'ADHD', 'sleep'], 1050, 'Online'],
  ['Physiotherapy', ['rehab', 'posture', 'pain'], 480, 'Both'],
  ['Endocrinology', ['thyroid', 'diabetes', 'PCOS'], 990, 'Offline'],
  ['Pulmonology', ['asthma', 'sleep', 'allergy'], 820, 'Both'],
  ['Ophthalmology', ['LASIK', 'glaucoma', 'dry eye'], 740, 'Offline'],
  ['Gastroenterology', ['GERD', 'liver', 'IBS'], 1020, 'Both'],
  ['Neurology', ['migraine', 'stroke risk', 'vertigo'], 1280, 'Offline'],
  ['Rheumatology', ['arthritis', 'lupus', 'pain'], 940, 'Both'],
  ['Urology', ['UTI', 'kidney', 'prostate'], 900, 'Offline'],
  ['Oncology', ['screening', 'chemo consult', 'tumor board'], 1600, 'Both'],
  ['Nephrology', ['CKD', 'dialysis', 'transplant'], 1080, 'Offline'],
  ['Nutrition', ['weight', 'diabetes diet', 'sports'], 420, 'Online'],
  ['General Surgery', ['hernia', 'gallbladder', 'proctology'], 1120, 'Offline'],
  ['Psychology', ['CBT', 'stress', 'grief'], 780, 'Online'],
  ['Radiology', ['MRI', 'CT', 'second opinion'], 640, 'Offline'],
  ['Internal Medicine', ['fever', 'polyclinic', 'checkup'], 560, 'Both'],
  ['Plastic Surgery', ['scar', 'reconstructive', 'cosmetic'], 2200, 'Offline'],
  ['Allergy & Immunology', ['food allergy', 'immunotherapy', 'urticaria'], 860, 'Both'],
  ['Hematology', ['anemia', 'clotting', 'blood disorder'], 1350, 'Offline'],
  ['Sports Medicine', ['ACL', 'concussion', 'return-to-play'], 980, 'Both'],
]

const FIRST = ['Aisha','Bhavya','Chirag','Devika','Eshaan','Farah','Gaurav','Harsha','Ishita','Jay','Kavya','Laksh','Meera','Nikhil','Ojas','Pari','Rahul','Saanvi','Tanvi','Uday','Vidya','Yash','Zara','Aman','Neha','Kiran']
const LAST = ['Menon','Kapoor','Sen','Nair','Reddy','Iyer','Verma','Patel','Das','Bose','Malhotra','Ghosh','Joseph','Kulkarni','Rao','Desai','Pillai','Khanna','Sethi','Babu','George','Noor','Singh','Khan','Bose','Ali']

function buildDoctors25to50() {
  const out = []
  for (let id = 25; id <= 50; id++) {
    const i = id - 25
    const [spec, diseases, baseFee, mode] = SPEC_ROWS[i % SPEC_ROWS.length]
    const hospitalId = ((id + i) % 12) + 1
    const rating = 4.1 + ((id * 7) % 9) / 10
    const reviewCount = 80 + ((id * 13) % 920)
    const fee = baseFee + ((id % 5) * 50)
    const name = `Dr. ${FIRST[i % FIRST.length]} ${LAST[i % LAST.length]}`
    const about = `${spec} specialist with focus on ${diseases[0]} and ${diseases[1]}. Evidence-based protocols.`
    out.push({
      id,
      name,
      specialization: spec,
      hospitalId,
      diseases,
      rating: Math.round(rating * 10) / 10,
      reviewCount,
      fee,
      mode,
      image: doctorImages[(id - 1) % doctorImages.length],
      about,
      description: about,
      reviews: ['Professional and punctual.', 'Explained options clearly.', 'Would recommend to family.'],
      phone: `+91 98765 ${11100 + id}`,
      slotsOnline: mode === 'Offline' ? [] : slotsPm,
      slotsOffline: mode === 'Online' ? [] : slotsAm,
    })
  }
  return out
}

export const bookingDoctors = [...coreBookingDoctors, ...buildDoctors25to50()]

export function enrichDoctors() {
  const hospitalMap = Object.fromEntries(bookingHospitals.map((h) => [h.id, h]))
  return bookingDoctors.map((d) => ({
    ...d,
    id: Number(d.id),
    description: d.description || d.about,
    hospitalName: hospitalMap[d.hospitalId]?.name || 'Hospital',
    hospitalImage: hospitalMap[d.hospitalId]?.image,
    hospitalLocation: hospitalMap[d.hospitalId]?.location,
    image: doctorImages[(Number(d.id) - 1) % doctorImages.length],
  }))
}

/** Resolve doctor from route param (numeric id only). */
export function getDoctorByParam(routeId) {
  const id = parseInt(String(routeId), 10)
  if (!Number.isFinite(id)) return undefined
  return enrichDoctors().find((d) => d.id === id)
}

/** Match saved appointment to catalog doctor id (fixes legacy rows without doctorId). */
export function resolveDoctorIdFromAppointment(apt) {
  if (!apt) return undefined
  const doctors = enrichDoctors()
  const num = apt.doctorId != null ? parseInt(String(apt.doctorId), 10) : NaN
  if (Number.isFinite(num) && doctors.some((d) => d.id === num)) return num
  const byNameHosp = doctors.find((d) => d.name === apt.doctor && d.hospitalName === apt.hospital)
  if (byNameHosp) return byNameHosp.id
  return doctors.find((d) => d.name === apt.doctor)?.id
}

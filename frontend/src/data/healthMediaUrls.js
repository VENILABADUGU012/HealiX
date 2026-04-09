/** Curated real image URLs for Booking + Pharmacy (avoid broken Unsplash/source links). */

export const doctorImages = [
  'https://curae.com/wp-content/uploads/2018/03/AdobeStock_168113506-1-e1522461533266-1037x1400.jpeg',
  'https://wallpapers.com/images/hd/doctor-pictures-l5y1qs2998u7rf0x.jpg',
  'https://img.freepik.com/premium-photo/female-doctor-wearing-white-coat-with-stethoscope-hospital-office_1034143-167.jpg?w=2000',
  'https://www.youngisthan.in/wp-content/uploads/2018/09/featured-1-11-970x702.jpg',
  'https://img.freepik.com/premium-photo/portrait-indian-doctor-indian-doctor-smiling_890100-1265.jpg',
  'https://img.freepik.com/premium-photo/indian-female-doctor-indian-nurse_714173-204.jpg?w=2000',
  'https://tse2.mm.bing.net/th/id/OIP.KTbYTUpHK9VXuBl5sRzKrAHaDt?pid=Api&P=0&h=180',
  'https://www.pagny.org/uploads/images/_widescreenLarge/PAGNY_031323_0603_Harlem.jpg',
  'https://as1.ftcdn.net/v2/jpg/02/98/31/80/1000_F_298318035_r94qk0ACDJCf9XEYL7FgYz65mVdbb7RI.jpg',
  'https://tse2.mm.bing.net/th/id/OIP.APjmKmC7pAwcvBCbKoxVmgHaGO?pid=Api&P=0&h=180',
]

export const hospitalImages = [
  'https://hhinternet.blob.core.windows.net/uploads/2025/03/NYC-Health-Hospitals-Bellevue-is-Nationally-Recognized-as-a-Center-of-Excellence-in-Surgical-Safety-2048x1292.jpg',
  'https://tse3.mm.bing.net/th/id/OIP.Wh9fO5YoVrzQ6VxXmnzT6QHaEo?pid=Api&P=0&h=180',
  'https://wolfmediausa.com/wp-content/uploads/2022/10/BehavioralHealth-Anchor-MetroHealth-ClevelandHeightsOH-interior-3976-2652.jpg',
  'https://www.onehealthhospitals.com/wp-content/uploads/2023/03/F3.jpg',
  'https://rehabs.org/wp-content/uploads/2021/09/jackson-behavioral-health-hospital-miami-fl-front.jpg',
  'https://wp.agakhanhospitals.org/wp-content/uploads/2022/03/Mwanza-Hospital-External-Night-View_PrayGod-Mushi-scaled.jpg',
  'https://tse1.mm.bing.net/th/id/OIP.zNpRwvnR0Ibw6yB2NZLodgHaE8?pid=Api&P=0&h=180',
  'https://tse2.mm.bing.net/th/id/OIP.wPVYQcTgednDqtC7wmD-8gHaHa?pid=Api&P=0&h=180',
  'https://tse4.mm.bing.net/th/id/OIP.xPZG16WUOtdfWNlgPh_l5QHaE7?pid=Api&P=0&h=180',
  'https://tse1.mm.bing.net/th/id/OIP.AbZGvuiEbpNXb8Ovv3ZQIAHaDQ?pid=Api&P=0&h=180',
]

export const medicineImages = {
  tablet:
    'https://c8.alamy.com/comp/2JB9YXW/different-types-of-medicine-blister-packs-medical-drugs-capsules-and-tablets-with-variety-of-colors-packages-for-pills-2JB9YXW.jpg',
  syrup: 'https://tse1.mm.bing.net/th/id/OIP.VnObSNj76g_YhJrsguaV0AHaHj?pid=Api&P=0&h=180',
  cream: 'https://hrtdoctorsgroup.com/wp-content/uploads/2023/02/How-To-Apply-Topical-Hormone-Cream.jpg',
  spray:
    'https://c8.alamy.com/comp/2PW8HKT/bottles-medicine-throat-spray-isolated-on-white-background-2PW8HKT.jpg',
  inhalant: 'https://tse3.mm.bing.net/th/id/OIP.lrw71-T7IVge1qnP_qKVOQHaEK?pid=Api&P=0&h=180',
}

const MED_ORDER = ['tablet', 'syrup', 'cream', 'spray', 'inhalant']

export function inferMedicineVisualType(name, category = '') {
  const n = `${name} ${category}`.toLowerCase()
  if (/syrup|ors|drink|elixir|tonic|suspension|electrolyte/.test(n)) return 'syrup'
  if (/spray|nasal|throat\s*spray|lozenge/.test(n)) return 'spray'
  if (/inhaler|inhalant|steam|vaporizer/.test(n)) return 'inhalant'
  if (/gel|cream|ointment|rub|vapo|volini|moov|topical|antifungal/.test(n)) return 'cream'
  return 'tablet'
}

/** Primary + gallery URLs for a product row. */
export function productMedicineImageSet(name, category, seed = 0) {
  const t = inferMedicineVisualType(name, category)
  const start = MED_ORDER.indexOf(t)
  const base = ((start >= 0 ? start : 0) + (Number(seed) || 0)) % MED_ORDER.length
  const images = [0, 1, 2, 3].map((k) => medicineImages[MED_ORDER[(base + k) % MED_ORDER.length]])
  return { image: medicineImages[t], images }
}

export function hospitalImageAt(id) {
  const n = hospitalImages.length
  return hospitalImages[((id - 1) % n + n) % n]
}

import { hospitalImageAt, medicineImages, productMedicineImageSet } from './healthMediaUrls'

/** Pharmacy catalog: stores + 50+ products */

export const pharmacyStores = [
  { id: 1, name: 'HealiX MedStore Koramangala', address: '80 Ft Rd, Koramangala 4th Block, Bengaluru', rating: 4.7, reviewCount: 2140, image: hospitalImageAt(1) },
  { id: 2, name: 'CarePlus Pharmacy Indiranagar', address: '100 Ft Rd, Near Metro, Bengaluru', rating: 4.6, reviewCount: 1890, image: hospitalImageAt(2) },
  { id: 3, name: 'AyurVeda Hub Whitefield', address: 'Graphite India Rd, Bengaluru', rating: 4.8, reviewCount: 920, image: hospitalImageAt(3) },
  { id: 4, name: 'QuickMeds HSR Layout', address: '17th Cross, HSR, Bengaluru', rating: 4.4, reviewCount: 1560, image: hospitalImageAt(4) },
  { id: 5, name: 'Wellness Mart Jayanagar', address: '4th Block Jayanagar, Bengaluru', rating: 4.5, reviewCount: 730, image: hospitalImageAt(5) },
  { id: 6, name: '24x7 MediPoint MG Road', address: 'MG Rd, Trinity Circle, Bengaluru', rating: 4.3, reviewCount: 3200, image: hospitalImageAt(6) },
  { id: 7, name: 'NutriPlus Electronic City', address: 'Phase 1, Electronic City', rating: 4.6, reviewCount: 540, image: hospitalImageAt(7) },
  { id: 8, name: 'Family Pharmacy Malleshwaram', address: 'Sampige Rd, Malleshwaram', rating: 4.7, reviewCount: 1100, image: hospitalImageAt(8) },
  { id: 9, name: 'GreenLeaf Ayurvedic BTM', address: 'BTM 2nd Stage, Bengaluru', rating: 4.9, reviewCount: 410, image: hospitalImageAt(9) },
  { id: 10, name: 'City Chemists Rajajinagar', address: 'Rajajinagar 1st Block', rating: 4.2, reviewCount: 890, image: hospitalImageAt(10) },
  { id: 11, name: 'VitaCare Yelahanka', address: 'New Town Yelahanka', rating: 4.5, reviewCount: 620, image: hospitalImageAt(11) },
  { id: 12, name: 'Apollo Affiliated Marathahalli', address: 'Outer Ring Rd, Marathahalli', rating: 4.6, reviewCount: 2400, image: hospitalImageAt(12) },
  { id: 13, name: 'Bloom Supplements Ulsoor', address: 'Ulsoor Lake Rd', rating: 4.4, reviewCount: 380, image: hospitalImageAt(13) },
  { id: 14, name: 'HealFast RT Nagar', address: 'RT Nagar Main Rd', rating: 4.5, reviewCount: 670, image: hospitalImageAt(14) },
  { id: 15, name: 'PureMed Banashankari', address: 'Banashankari 3rd Stage', rating: 4.3, reviewCount: 510, image: hospitalImageAt(15) },
]

export const pharmacyRecommendationSlides = [
  {
    id: 'cold',
    title: 'Best medicines for cold',
    description: 'Cough, cold & flu relief from trusted brands',
    detailBody: 'Browse antihistamines, decongestants, and combination cold kits curated by pharmacists.',
    filterTags: ['cold', 'cough', 'flu'],
    image: medicineImages.tablet,
    productPreviewImage: medicineImages.syrup,
    reviews: ['Fast delivery on syrups.', 'Genuine packaging.', 'Saved during monsoon season.'],
  },
  {
    id: 'wellness50',
    title: '50% off wellness kits',
    description: 'Immunity & daily care bundles',
    detailBody: 'Limited-time bundles: vitamins, masks, and sanitizers at half price from partner stores.',
    filterTags: ['wellness', 'kit', 'immunity'],
    image: medicineImages.syrup,
    productPreviewImage: medicineImages.tablet,
    reviews: ['Great value combo.', 'Arrived same day.', 'Quality verified.'],
  },
  {
    id: 'ayurvedic',
    title: 'Top Ayurvedic products',
    description: 'Classical and modern ayurvedic formulations',
    filterTags: ['ayurvedic', 'herbal', 'digestive'],
    image: medicineImages.cream,
    productPreviewImage: medicineImages.tablet,
    reviews: ['Authentic brands.', 'Ayurvedic hub store is best.', 'Chyawanprash original seal.'],
  },
  {
    id: 'supplements',
    title: 'Daily supplements',
    description: 'Protein, omega, multivitamins & minerals',
    filterTags: ['supplements', 'vitamin', 'protein'],
    image: medicineImages.tablet,
    productPreviewImage: medicineImages.inhalant,
    reviews: ['Third-party tested labels.', 'Subscription reminders help.', 'Cheaper than retail.'],
  },
]

export function productImageSet(name, category, seed) {
  return productMedicineImageSet(name, category, seed)
}

const BASE_PRODUCTS = [
  ['Dolo 650 Tablets', 'Pain & Fever', ['fever', 'pain', 'headache'], 28],
  ['Cetirizine 10mg', 'Cold & Allergy', ['cold', 'cough', 'allergy'], 45],
  ['Azithromycin 500', 'Antibiotic', ['infection', 'fever'], 112],
  ['ORS Lemon', 'Hydration', ['flu', 'dehydration', 'wellness'], 22],
  ['Vicks VapoRub', 'Cold Relief', ['cold', 'cough'], 95],
  ['Tulsi Cough Syrup', 'Ayurvedic', ['ayurvedic', 'cough', 'cold'], 130],
  ['Chyawanprash 1kg', 'Ayurvedic', ['ayurvedic', 'immunity', 'wellness'], 340],
  ['Omega-3 Fish Oil', 'Supplements', ['supplements', 'heart', 'wellness'], 560],
  ['Vitamin D3 60k', 'Supplements', ['supplements', 'vitamin', 'bone'], 180],
  ['Whey Protein 1kg', 'Supplements', ['supplements', 'protein', 'fitness'], 1899],
  ['Electral Powder', 'Hydration', ['flu', 'wellness', 'kit'], 18],
  ['Becosules Caps', 'Vitamins', ['supplements', 'vitamin', 'wellness'], 95],
  ['Pan-D Capsule', 'Digestive', ['digestive', 'GERD', 'acidity'], 155],
  ['Zincovit Tablet', 'Immunity', ['wellness', 'immunity', 'kit'], 88],
  ['Hexigel Mouth Gel', 'Dental', ['pain', 'mouth'], 72],
]

function availabilityFor(id) {
  const m = id % 7
  if (m === 0) return 'Out of Stock'
  if (m === 1) return 'Low Stock'
  return 'In Stock'
}

function buildProductsCatalog() {
  const list = []
  let id = 1
  BASE_PRODUCTS.forEach(([name, category, issues, price]) => {
    const storeId = ((id + 2) % 15) + 1
    const { image, images } = productImageSet(name, category, id)
    list.push({
      id: id++,
      name,
      category,
      healthIssues: issues,
      storeId,
      price,
      rating: 4 + ((id * 3) % 10) / 10,
      reviewCount: 40 + (id * 17) % 800,
      availability: availabilityFor(id),
      image,
      images,
      description: `${name} — trusted formulation for ${category.toLowerCase()}. Store-verified cold chain where applicable.`,
      usage: 'Use as directed on pack or by pharmacist. Do not exceed stated dose.',
      safety: 'Not for children unless labeled. Read label for contraindications. Consult doctor if pregnant or on other medication.',
      reviews: ['Effective and genuine.', 'Good expiry date.', 'Quick doorstep delivery.'],
    })
  })

  const extraNames = [
    'Paracetamol 500 Strip', 'Levocetirizine 5mg', 'Montelukast 10mg', 'Salbutamol Inhaler', 'Insulin Pen Needles',
    'Calcium + D3', 'Iron + Folic', 'Probiotic Caps', 'Isabgol Husk', 'Eno Fruit Salt', 'Digene Tablets',
    'Moov Spray', 'Volini Gel', 'Combiflam', 'Brufen 400', 'Amoxicillin Clav', 'Cough Lozenges', 'Nasal Spray',
    'Steam Inhalant Caps', 'Hand Sanitizer 500ml', 'N95 Masks Pack', 'Glucometer Strips', 'BP Monitor Cuff',
    'Bandage Roll', 'Antiseptic Liquid', 'ORS Apple', 'Zinc Tablets', 'Multivitamin Gummies', 'Biotin 10mg',
    'Collagen Powder', 'Melatonin 3mg', 'Ashwagandha Caps', 'Triphala Tablets', 'Sitopaladi Churna', 'Honey Ginger Syrup',
    'Laxative Syrup', 'Antacid Gel', 'Antifungal Cream', 'Antiseptic Ointment', 'ORS Orange', 'Electrolyte Drink',
    'Kids Multivitamin Syrup', 'ORS Mixed Berry', 'Herbal Throat Spray', 'Eucalyptus Oil', 'Camphor Rub',
    'Steam Vaporizer', 'Pulse Oximeter',
  ]

  const cats = ['Cold & Allergy', 'Pain & Fever', 'Ayurvedic', 'Supplements', 'Wellness', 'Digestive', 'First Aid', 'Devices']
  const issuePools = [
    ['cold', 'cough'], ['fever', 'pain'], ['ayurvedic', 'herbal'], ['supplements', 'vitamin'], ['wellness', 'kit'],
    ['digestive', 'acidity'], ['injury', 'first aid'], ['monitoring', 'wellness'],
  ]

  extraNames.forEach((name, i) => {
    const cat = cats[i % cats.length]
    const price = 35 + (i * 23) % 900
    const storeId = ((id + i) % 15) + 1
    const pid = id
    const { image, images } = productImageSet(name, cat, pid + i * 7)
    list.push({
      id: id++,
      name,
      category: cat,
      healthIssues: issuePools[i % issuePools.length],
      storeId,
      price,
      rating: 4 + ((i * 5) % 10) / 10,
      reviewCount: 30 + (i * 19) % 1200,
      availability: availabilityFor(id + i),
      image,
      images,
      description: `${name} for ${cat.toLowerCase()} needs. Sourced from licensed distributors.`,
      usage: 'Follow pack insert. Typical adult dosing unless prescribed otherwise.',
      safety: 'Keep away from children. Check allergens. Do not combine with alcohol unless cleared by clinician.',
      reviews: ['Works as expected.', 'Packaging intact.', 'Reasonable MRP.'],
    })
  })

  return list
}

export const pharmacyProducts = buildProductsCatalog()

export function enrichProducts() {
  const sm = Object.fromEntries(pharmacyStores.map((s) => [s.id, s]))
  return pharmacyProducts.map((p) => ({
    ...p,
    storeName: sm[p.storeId]?.name || 'Pharmacy',
    storeAddress: sm[p.storeId]?.address || '',
    storeImage: sm[p.storeId]?.image,
    storeRating: sm[p.storeId]?.rating,
    storeReviewCount: sm[p.storeId]?.reviewCount,
  }))
}

export function getProductById(productId) {
  return enrichProducts().find((p) => p.id === Number(productId))
}

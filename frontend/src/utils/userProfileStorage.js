const KEY = 'healix_user_profile_v1'

const defaults = {
  name: 'Venil Kumar',
  email: 'venil@example.com',
  phone: '+91 99999 00000',
  dob: '1995-06-15',
  gender: 'Male',
  bloodGroup: 'B+',
  aadhar: 'XXXX-XXXX-4123',
  abhaId: 'ABHA-12-3456-789012',
}

export function loadUserProfile() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaults }
    return { ...defaults, ...JSON.parse(raw) }
  } catch {
    return { ...defaults }
  }
}

export function saveUserProfile(patch) {
  const next = { ...loadUserProfile(), ...patch }
  localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new CustomEvent('healix-user-profile-changed'))
  return next
}

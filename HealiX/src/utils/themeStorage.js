const THEME_KEY = 'healix-theme'
export const THEME_EVENT = 'healix-theme-changed'

export function getStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function applyTheme(mode) {
  const root = document.documentElement
  if (mode === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
}

export function setStoredTheme(mode) {
  const next = mode === 'dark' ? 'dark' : 'light'
  try {
    localStorage.setItem(THEME_KEY, next)
  } catch {
    /* ignore */
  }
  applyTheme(next)
  window.dispatchEvent(new CustomEvent(THEME_EVENT))
}

export function initThemeFromStorage() {
  applyTheme(getStoredTheme())
}

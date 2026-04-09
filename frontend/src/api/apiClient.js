const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.healix.local'

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function simulateRequest(data, options = {}) {
  const { failRate = 0.05, minDelay = 350, maxDelay = 900 } = options
  const ms = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay
  await delay(ms)

  if (Math.random() < failRate) {
    throw new Error('Network request failed. Please try again.')
  }

  return data
}

export function getApiMeta() {
  return {
    baseUrl: API_BASE_URL,
    env: import.meta.env.VITE_APP_ENV || 'development',
  }
}

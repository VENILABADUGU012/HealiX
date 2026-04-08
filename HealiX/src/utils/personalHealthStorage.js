const TASKS_KEY = 'healix_personal_health_tasks_v1'
const MED_TODAY_KEY = 'healix_personal_health_meds_today_v1'
const HISTORY_KEY = 'healix_personal_health_daily_v1'
const ACTIVITY_KEY = 'healix_personal_health_activity_v1'

export const PERSONAL_HEALTH_EVENT = 'healix-personal-health-changed'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

function emit() {
  window.dispatchEvent(new CustomEvent(PERSONAL_HEALTH_EVENT))
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY)
    if (!raw) return getDefaultTasks()
    const p = JSON.parse(raw)
    return Array.isArray(p) && p.length ? p : getDefaultTasks()
  } catch {
    return getDefaultTasks()
  }
}

function getDefaultTasks() {
  return [
    { id: 't-water', label: 'Drink 8 glasses of water', completed: false },
    { id: 't-exercise', label: 'Exercise 30 minutes', completed: false },
    { id: 't-sleep', label: 'Sleep 7+ hours', completed: false },
  ]
}

export function saveTasks(tasks) {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  recordTaskDayStats(tasks)
  emit()
}

export function recordTaskDayStats(tasks) {
  const day = todayKey()
  const total = tasks.length
  const completed = tasks.filter((t) => t.completed).length
  try {
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
    hist[day] = { ...hist[day], tasksTotal: total, tasksDone: completed, at: new Date().toISOString() }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist))
  } catch {
    /* ignore */
  }
}

export function loadMedChecksForToday() {
  const day = todayKey()
  try {
    const all = JSON.parse(localStorage.getItem(MED_TODAY_KEY) || '{}')
    return all[day] && typeof all[day] === 'object' ? all[day] : {}
  } catch {
    return {}
  }
}

export function setMedChecked(medId, checked) {
  const day = todayKey()
  try {
    const all = JSON.parse(localStorage.getItem(MED_TODAY_KEY) || '{}')
    if (!all[day]) all[day] = {}
    all[day][medId] = checked
    localStorage.setItem(MED_TODAY_KEY, JSON.stringify(all))
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
    const meds = Object.values(all[day]).filter(Boolean).length
    const medTotal = Object.keys(all[day]).length
    hist[day] = { ...hist[day], medsDone: meds, medsTotal: medTotal, at: new Date().toISOString() }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist))
  } catch {
    /* ignore */
  }
  emit()
}

export function loadDayHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '{}')
  } catch {
    return {}
  }
}

export function loadActivitySeries() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({
      date: key,
      steps: 4000 + ((i * 773) % 5000),
      waterL: 1.2 + ((i * 0.21) % 1.5),
      sleepH: 6 + ((i * 0.3) % 2.5),
    })
  }
  return days
}

export function saveActivitySeries(series) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(series))
  emit()
}

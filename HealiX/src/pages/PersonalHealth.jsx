import { useCallback, useEffect, useMemo, useState } from 'react'
import Tesseract from 'tesseract.js'
import PageHeader from '../components/common/PageHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Input from '../components/ui/Input'
import { APPOINTMENTS_EVENT, loadAppointments } from '../utils/bookingStorage'
import { buildClinicalNotes, extractMedicationsFromAppointment } from '../utils/clinicalNotes'
import {
  PERSONAL_HEALTH_EVENT,
  loadDayHistory,
  loadMedChecksForToday,
  loadTasks,
  saveTasks,
  setMedChecked,
} from '../utils/personalHealthStorage'
import {
  PRESCRIPTION_SCAN_EVENT,
  loadLatestPrescriptionScan,
  savePrescriptionScan,
} from '../utils/prescriptionScanStorage'

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

const MOCK_DOCTOR_NOTES = {
  diagnosisSummary: 'Routine follow-up — vitals stable; continue lifestyle measures discussed previously.',
  prescriptionNotes: 'Continue current medications as directed. OTC paracetamol 500mg as needed for mild pain (max per label).',
  doctorAdvice: [
    'Diet: balanced meals, limit processed sugar and late heavy meals.',
    'Rest: 7–8h sleep; short breaks if desk work.',
    'Lifestyle: 150 minutes/week moderate activity; stay hydrated.',
  ],
}

function sortAppointmentsDesc(appointments) {
  return [...appointments].sort((a, b) => {
    const da = `${a.date || ''} ${a.time || ''}`
    const db = `${b.date || ''} ${b.time || ''}`
    return db.localeCompare(da)
  })
}

function computeStreak(history) {
  const keys = Object.keys(history).sort().reverse()
  let streak = 0
  for (let i = 0; i < keys.length; i += 1) {
    const day = keys[i]
    const row = history[day]
    if (!row || !row.tasksTotal) break
    const pct = row.tasksDone / row.tasksTotal
    if (pct >= 1) streak += 1
    else break
  }
  return streak
}

function PersonalHealth() {
  const [tasks, setTasksState] = useState(loadTasks)
  const [medChecks, setMedChecks] = useState(loadMedChecksForToday)
  const [dayHistory, setDayHistory] = useState(loadDayHistory)
  const [newTaskLabel, setNewTaskLabel] = useState('')
  const [apptRev, setApptRev] = useState(0)
  const [scanFile, setScanFile] = useState(null)
  const [scanLoading, setScanLoading] = useState(false)
  const [scanError, setScanError] = useState('')
  const [latestScan, setLatestScan] = useState(() => loadLatestPrescriptionScan())

  const refresh = useCallback(() => {
    setTasksState(loadTasks())
    setMedChecks(loadMedChecksForToday())
    setDayHistory(loadDayHistory())
  }, [])

  const onAppointmentsChanged = useCallback(() => {
    setApptRev((x) => x + 1)
    refresh()
  }, [refresh])

  useEffect(() => {
    window.addEventListener(PERSONAL_HEALTH_EVENT, refresh)
    window.addEventListener(APPOINTMENTS_EVENT, onAppointmentsChanged)
    const onScan = () => setLatestScan(loadLatestPrescriptionScan())
    window.addEventListener(PRESCRIPTION_SCAN_EVENT, onScan)
    return () => {
      window.removeEventListener(PERSONAL_HEALTH_EVENT, refresh)
      window.removeEventListener(APPOINTMENTS_EVENT, onAppointmentsChanged)
      window.removeEventListener(PRESCRIPTION_SCAN_EVENT, onScan)
    }
  }, [refresh, onAppointmentsChanged])

  const medications = ((appointmentRevision) => {
    void appointmentRevision
    const apts = loadAppointments().filter((a) => a.status !== 'Cancelled')
    const map = new Map()
    apts.forEach((apt) => {
      extractMedicationsFromAppointment(apt).forEach((m) => {
        const k = `${m.name}|${m.timing}|${m.appointmentId}`
        if (!map.has(k)) map.set(k, m)
      })
    })
    return [...map.values()]
  })(apptRev)

  const taskDone = tasks.filter((t) => t.completed).length
  const taskTotal = tasks.length || 1
  const medTaken = medications.filter((m) => medChecks[m.id]).length
  const medTotal = medications.length || 1

  const healthScore = Math.min(
    100,
    Math.round((taskDone / taskTotal) * 50 + (medications.length ? (medTaken / medTotal) * 50 : 25)),
  )

  const scoreLabel =
    healthScore >= 70 ? 'Good' : healthScore >= 45 ? 'Average' : 'Needs Improvement'

  const streak = computeStreak(dayHistory)

  const last7 = useMemo(() => {
    const hist = dayHistory
    const out = []
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      const row = hist[key]
      const pct =
        row?.tasksTotal && row.tasksTotal > 0 ? Math.round((100 * row.tasksDone) / row.tasksTotal) : null
      out.push({ key, pct, label: d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) })
    }
    return out
  }, [dayHistory])

  const weekAvgPct = useMemo(() => {
    const vals = last7.map((x) => x.pct).filter((v) => v != null)
    if (!vals.length) return 0
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
  }, [last7])

  const doctorNotes = ((appointmentRevision) => {
    void appointmentRevision
    const active = loadAppointments().filter((a) => a.status !== 'Cancelled')
    if (active.length === 0) {
      return { source: 'sample', ...MOCK_DOCTOR_NOTES }
    }
    const latest = sortAppointmentsDesc(active)[0]
    const clinical = buildClinicalNotes(latest)
    return {
      source: 'appointment',
      visitLabel: `${latest.doctor || 'Your doctor'} · ${latest.date || ''} ${latest.time || ''}`.trim(),
      diagnosisSummary: clinical.diagnosis,
      prescriptionNotes: clinical.prescriptionNotes,
      doctorAdvice: clinical.suggestions,
    }
  })(apptRev)

  const toggleTask = (id) => {
    const next = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    setTasksState(next)
    saveTasks(next)
  }

  const addTask = () => {
    const label = newTaskLabel.trim()
    if (!label) return
    const id = `t-${Date.now()}`
    const next = [...tasks, { id, label, completed: false }]
    setTasksState(next)
    saveTasks(next)
    setNewTaskLabel('')
  }

  const removeTask = (id) => {
    const next = tasks.filter((t) => t.id !== id)
    setTasksState(next)
    saveTasks(next)
  }

  const onMedToggle = (medId, checked) => {
    setMedChecked(medId, checked)
    setMedChecks(loadMedChecksForToday())
    setDayHistory(loadDayHistory())
  }

  const scanPrescription = async () => {
    if (!scanFile || scanLoading) return
    setScanLoading(true)
    setScanError('')
    try {
      const result = await Tesseract.recognize(scanFile, 'eng')
      const raw = (result?.data?.text || '').trim()
      const cleaned = raw.replace(/\s+/g, ' ').trim()
      const shortSummary = cleaned ? cleaned.slice(0, 240) : 'No text detected from prescription image.'
      const saved = savePrescriptionScan({
        fileName: scanFile.name || 'prescription-image',
        text: raw || '',
        summary: shortSummary,
      })
      setLatestScan(saved)
    } catch {
      setScanError('Unable to scan image. Please try a clearer prescription photo.')
    } finally {
      setScanLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Personal Health"
        subtitle="Smart dashboard — habits, meds, and progress in one place."
      />

      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/80 p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-800">Daily summary</p>
        <p className="mt-1 text-sm text-slate-600">
          {taskDone}/{taskTotal} habits done · {medications.length ? `${medTaken}/${medications.length} doses logged` : 'No active prescriptions from visits'}{' '}
          · Streak {streak} day{streak === 1 ? '' : 's'} 🔥
        </p>
        <p className="mt-2 text-xs text-slate-500">Reminder (mock): Aim for water before noon and a 10‑minute walk.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <Card className="shadow-md lg:col-span-1">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Health score</p>
          <p className="mt-2 text-4xl font-bold text-slate-800">{healthScore}</p>
          <p className="text-sm text-slate-500">out of 100</p>
          <div className="mt-3">
            <Badge tone={healthScore >= 70 ? 'success' : healthScore >= 45 ? 'warning' : 'info'}>{scoreLabel}</Badge>
          </div>
        </Card>
        <Card title="Weekly progress" className="shadow-md lg:col-span-2">
          <p className="mb-2 text-sm text-slate-600">Task completion (7 days avg): {weekAvgPct}%</p>
          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-blue-600 transition-all"
              style={{ width: `${weekAvgPct}%` }}
            />
          </div>
              <div className="mt-4 flex justify-between gap-1">
            {last7.map((d) => (
              <div key={d.key} className="flex-1 text-center">
                <div
                  className="mx-auto mb-1 flex h-16 items-end justify-center rounded-lg bg-gray-100 px-0.5"
                  title={d.pct != null ? `${d.pct}%` : '—'}
                >
                  <div
                    className="w-full max-w-[28px] rounded-t bg-emerald-500/90"
                    style={{ height: d.pct != null ? `${Math.max(10, Math.min(100, d.pct))}%` : '6px' }}
                  />
                </div>
                <p className="text-[10px] text-slate-500">{d.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="shadow-md lg:col-span-1">
          <p className="text-sm font-medium text-slate-800">Streak 🔥</p>
          <p className="mt-2 text-3xl font-semibold text-amber-600">{streak}</p>
          <p className="text-xs text-slate-500">Consecutive days all habits checked</p>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Daily tasks / habits" className="shadow-md">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row">
            <Input
              placeholder="Add a custom task…"
              value={newTaskLabel}
              onChange={(e) => setNewTaskLabel(e.target.value)}
              className="flex-1"
            />
            <Button type="button" onClick={addTask}>
              Add
            </Button>
          </div>
          <ul className="space-y-2">
            {tasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 shadow-sm"
              >
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTask(t.id)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <span className={`flex-1 text-sm ${t.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {t.label}
                </span>
                <button
                  type="button"
                  className="text-xs text-rose-600 hover:underline"
                  onClick={() => removeTask(t.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Medication tracker" className="shadow-md">
          <p className="mb-3 text-xs text-slate-500">
            Pulled from your booked visits (mock Rx notes). Check off when taken today — {todayISO()}.
          </p>
          {medications.length === 0 ? (
            <p className="text-sm text-slate-500">Complete a booking visit to see prescriptions here.</p>
          ) : (
            <ul className="space-y-2">
              {medications.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(medChecks[m.id])}
                    onChange={(e) => onMedToggle(m.id, e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                  />
                  <span className="text-sm text-slate-800">
                    {m.name} <span className="text-slate-500">({m.timing})</span>
                  </span>
                  <Badge tone="default">{m.durationDays}d course</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Doctor notes" className="shadow-md ring-2 ring-blue-100 dark:ring-blue-900/50">
        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
          {doctorNotes.source === 'appointment'
            ? `From your latest visit: ${doctorNotes.visitLabel}`
            : 'Sample notes — complete a booking visit to pull structured notes from your appointments.'}
        </p>
        <div className="space-y-4 rounded-xl border border-blue-200/80 bg-gradient-to-br from-blue-50/90 to-white p-5 shadow-inner dark:border-blue-900/40 dark:from-blue-950/30 dark:to-slate-900/80">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">Diagnosis summary</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{doctorNotes.diagnosisSummary}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">Prescription notes</p>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-800 dark:text-slate-200">{doctorNotes.prescriptionNotes}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-300">Doctor advice</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
              {doctorNotes.doctorAdvice.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card title="Prescription scanner (OCR)" className="shadow-md">
        <p className="text-xs text-slate-500">
          Upload a prescription image to extract text using free on-device OCR.
        </p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScanFile(e.target.files?.[0] || null)}
            className="text-sm"
          />
          <Button type="button" onClick={scanPrescription} disabled={!scanFile || scanLoading}>
            {scanLoading ? 'Scanning…' : 'Scan prescription'}
          </Button>
        </div>
        {scanError ? <p className="mt-2 text-xs text-rose-600">{scanError}</p> : null}
        {latestScan ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-700">
              Latest scan: {latestScan.fileName} · {new Date(latestScan.createdAt).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-slate-700">{latestScan.summary}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No prescription scans yet.</p>
        )}
      </Card>
    </div>
  )
}

export default PersonalHealth

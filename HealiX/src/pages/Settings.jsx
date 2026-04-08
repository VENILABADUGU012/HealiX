import { useState } from 'react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import PageHeader from '../components/common/PageHeader'
import { getStoredTheme, setStoredTheme } from '../utils/themeStorage'

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-700 dark:bg-slate-800/50">
      <span>
        <span className="block text-sm font-medium text-slate-800 dark:text-slate-100">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition ${checked ? 'translate-x-5' : ''}`}
        />
      </button>
    </label>
  )
}

function Settings() {
  const [profileEditing, setProfileEditing] = useState(false)
  const [name, setName] = useState('Venil Kumar')
  const [email, setEmail] = useState('venil@example.com')
  const [phone, setPhone] = useState('+91 99999 00000')

  const [passwordCurrent, setPasswordCurrent] = useState('')
  const [passwordNew, setPasswordNew] = useState('')
  const [twoFactor, setTwoFactor] = useState(false)

  const [profileVisible, setProfileVisible] = useState(true)
  const [medicalDataPrivate, setMedicalDataPrivate] = useState(true)
  const [dataSharing, setDataSharing] = useState(false)

  const [notifAppointments, setNotifAppointments] = useState(true)
  const [notifMedicines, setNotifMedicines] = useState(true)
  const [notifOrders, setNotifOrders] = useState(true)
  const [notifMessages, setNotifMessages] = useState(true)
  const [notifPromotions, setNotifPromotions] = useState(false)

  const [darkMode, setDarkMode] = useState(() => getStoredTheme() === 'dark')

  const [emergencyPrimary, setEmergencyPrimary] = useState('Aman Kumar — +91 88888 77777')
  const [emergencySecondary, setEmergencySecondary] = useState('Sana Ali — +91 77777 66666')

  const sessions = [
    { id: '1', device: 'Chrome on Windows', location: 'Mumbai, IN', when: 'Active now' },
    { id: '2', device: 'HealiX mobile (mock)', location: 'Bengaluru, IN', when: '2 days ago' },
  ]

  const onDarkToggle = (on) => {
    setDarkMode(on)
    setStoredTheme(on ? 'dark' : 'light')
  }

  const mockChangePassword = () => {
    if (!passwordNew.trim()) return
    setPasswordCurrent('')
    setPasswordNew('')
    window.alert('Password updated (mock — no server).')
  }

  const mockQuickCall = (who) => {
    window.alert(`Quick call (mock): ${who}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" subtitle="Profile, security, privacy, and preferences in one place." />

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Profile settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Your basic account details.</p>
        <div className="mt-4 space-y-3">
          <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!profileEditing} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!profileEditing} />
          <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!profileEditing} />
          <Button type="button" variant={profileEditing ? 'primary' : 'secondary'} onClick={() => setProfileEditing((e) => !e)}>
            {profileEditing ? 'Save profile' : 'Edit profile'}
          </Button>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Security settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Password and how you sign in.</p>
        <div className="mt-4 space-y-3">
          <Input
            label="Current password"
            type="password"
            value={passwordCurrent}
            onChange={(e) => setPasswordCurrent(e.target.value)}
            autoComplete="current-password"
          />
          <Input
            label="New password"
            type="password"
            value={passwordNew}
            onChange={(e) => setPasswordNew(e.target.value)}
            autoComplete="new-password"
          />
          <Button type="button" onClick={mockChangePassword}>
            Change password
          </Button>
        </div>
        <div className="mt-6">
          <ToggleRow label="Two-factor authentication" description="Extra step at sign-in (mock toggle)." checked={twoFactor} onChange={setTwoFactor} />
        </div>
        <div className="mt-6">
          <p className="text-sm font-medium text-slate-800 dark:text-slate-100">Active sessions</p>
          <ul className="mt-2 space-y-2">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-slate-600"
              >
                <span className="text-slate-700 dark:text-slate-200">
                  {s.device}
                  <span className="text-slate-500 dark:text-slate-400"> · {s.location}</span>
                </span>
                <span className="text-xs text-slate-500">{s.when}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Privacy settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Control visibility and sharing.</p>
        <div className="mt-4 space-y-3">
          <ToggleRow
            label="Profile visibility"
            description="Allow care providers in-app to see your public profile snippet."
            checked={profileVisible}
            onChange={setProfileVisible}
          />
          <ToggleRow
            label="Medical data privacy"
            description="When on, sensitive health tiles stay collapsed until you expand them."
            checked={medicalDataPrivate}
            onChange={setMedicalDataPrivate}
          />
          <ToggleRow
            label="Data sharing preferences"
            description="Share anonymized usage to improve recommendations (mock)."
            checked={dataSharing}
            onChange={setDataSharing}
          />
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Notification settings</h2>
        <div className="mt-4 space-y-3">
          <ToggleRow label="Appointments" checked={notifAppointments} onChange={setNotifAppointments} />
          <ToggleRow label="Medicines" checked={notifMedicines} onChange={setNotifMedicines} />
          <ToggleRow label="Orders" checked={notifOrders} onChange={setNotifOrders} />
          <ToggleRow label="Messages" checked={notifMessages} onChange={setNotifMessages} />
          <ToggleRow label="Promotions" checked={notifPromotions} onChange={setNotifPromotions} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Appearance</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Theme applies across the app (stored on this device).</p>
        <div className="mt-4 space-y-3">
          <ToggleRow label="Dark mode" description="Uses the dark class on the document root." checked={darkMode} onChange={onDarkToggle} />
        </div>
      </section>

      <section className="rounded-xl bg-white p-5 shadow-md ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Emergency settings</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Contacts for urgent reach-out (mock actions).</p>
        <div className="mt-4 space-y-3">
          <Input label="Primary emergency contact" value={emergencyPrimary} onChange={(e) => setEmergencyPrimary(e.target.value)} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={() => mockQuickCall(emergencyPrimary)}>
              Quick call — primary
            </Button>
          </div>
          <Input label="Secondary emergency contact" value={emergencySecondary} onChange={(e) => setEmergencySecondary(e.target.value)} />
          <Button type="button" variant="outline" onClick={() => mockQuickCall(emergencySecondary)}>
            Quick call — secondary
          </Button>
        </div>
      </section>

      <Card title="About this screen" className="shadow-md">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Toggles and fields are stored in React state for this session; dark mode is persisted in localStorage as healix-theme.
        </p>
      </Card>
    </div>
  )
}

export default Settings

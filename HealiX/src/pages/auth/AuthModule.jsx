import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { onHealthImageError } from '../../utils/healthMediaFallback'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
const phoneRegex = /^\d{10}$/
const aadharRegex = /^\d{12}$/
const abhaRegex = /^(\d{14}|\d{4}-\d{4}-\d{4})$/
const conditionOptions = ['Diabetes', 'Blood Pressure', 'Asthma', 'Thyroid', 'Heart Disease']

const loginInitial = {
  email: '',
  password: '',
  rememberMe: false,
}

const signupInitial = {
  fullName: '',
  dob: '',
  gender: '',
  phone: '',
  aadhar: '',
  abhaId: '',
  bloodGroup: '',
  height: '',
  weight: '',
  existingConditions: [],
  emergencyName: '',
  emergencyPhone: '',
  email: '',
  password: '',
  confirmPassword: '',
}

function Field({ label, error, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-600">{error}</span> : null}
    </label>
  )
}

function AuthModule({ initialTab = 'signin' }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState(initialTab)
  const [loginForm, setLoginForm] = useState(loginInitial)
  const [signupForm, setSignupForm] = useState(signupInitial)
  const [loginTouched, setLoginTouched] = useState({})
  const [signupTouched, setSignupTouched] = useState({})
  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false)
  const [isSignupSubmitted, setIsSignupSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignupPassword, setShowSignupPassword] = useState(false)
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false)
  const [conditionInput, setConditionInput] = useState('')

  useEffect(() => {
    setTab(initialTab)
  }, [initialTab])

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-3 py-2.5 text-sm outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-500 ${
      hasError ? 'border-rose-500' : 'border-slate-300 focus:border-blue-500'
    }`

  const loginValidation = useMemo(
    () => ({
      email: !loginForm.email
        ? 'Email is required.'
        : !emailRegex.test(loginForm.email)
          ? 'Enter a valid email address.'
          : '',
      password: !loginForm.password ? 'Password is required.' : '',
    }),
    [loginForm],
  )

  const signupValidation = useMemo(
    () => ({
      fullName: signupForm.fullName.trim() ? '' : 'Full name is required.',
      dob: signupForm.dob ? '' : 'DOB is required.',
      gender: signupForm.gender ? '' : 'Gender is required.',
      phone: !phoneRegex.test(signupForm.phone) ? 'Phone must be exactly 10 digits.' : '',
      aadhar: !aadharRegex.test(signupForm.aadhar) ? 'Aadhar must be exactly 12 digits.' : '',
      abhaId: !abhaRegex.test(signupForm.abhaId) ? 'ABHA must be 14 digits or xxxx-xxxx-xxxx.' : '',
      bloodGroup: signupForm.bloodGroup ? '' : 'Blood group is required.',
      height: signupForm.height.trim() ? '' : 'Height is required.',
      weight: signupForm.weight.trim() ? '' : 'Weight is required.',
      existingConditions: signupForm.existingConditions.length > 0 ? '' : 'Existing conditions are required.',
      emergencyName: signupForm.emergencyName.trim() ? '' : 'Emergency contact name is required.',
      emergencyPhone: !phoneRegex.test(signupForm.emergencyPhone) ? 'Emergency number must be 10 digits.' : '',
      email: !emailRegex.test(signupForm.email) ? 'Enter a valid email address.' : '',
      password: !passwordRegex.test(signupForm.password)
        ? 'Password must be 8+ chars with uppercase, lowercase, and number.'
        : '',
      confirmPassword:
        signupForm.confirmPassword !== signupForm.password ? 'Passwords do not match.' : '',
    }),
    [signupForm],
  )

  const onToggleTab = (nextTab) => {
    setSubmitError('')
    if (nextTab === 'signin') {
      setIsLoginSubmitted(false)
      setLoginTouched({})
    } else {
      setIsSignupSubmitted(false)
      setSignupTouched({})
    }
    setTab(nextTab)
    navigate(nextTab === 'signin' ? '/login' : '/signup')
  }

  const getLoginError = (field) =>
    isLoginSubmitted || loginTouched[field] ? loginValidation[field] : ''

  const getSignupError = (field) =>
    isSignupSubmitted || signupTouched[field] ? signupValidation[field] : ''

  const onLoginChange = (key, value) => {
    const next = { ...loginForm, [key]: value }
    setLoginForm(next)
  }

  const onSignupChange = (key, value) => {
    let nextValue = value
    if (['phone', 'emergencyPhone'].includes(key)) {
      nextValue = value.replace(/\D/g, '').slice(0, 10)
    }
    if (key === 'aadhar') {
      nextValue = value.replace(/\D/g, '').slice(0, 12)
    }
    if (key === 'abhaId') {
      nextValue = value.replace(/[^\d-]/g, '').slice(0, 14)
    }
    if (['height', 'weight'].includes(key)) {
      nextValue = value.replace(/[^\d.]/g, '')
    }

    const next = { ...signupForm, [key]: nextValue }
    setSignupForm(next)
  }

  const addCondition = (value) => {
    const normalized = value.trim()
    if (!normalized) return

    const exists = signupForm.existingConditions.some(
      (item) => item.toLowerCase() === normalized.toLowerCase(),
    )
    if (exists) {
      setConditionInput('')
      return
    }

    const nextConditions = [...signupForm.existingConditions, normalized]
    setSignupForm((prev) => ({ ...prev, existingConditions: nextConditions }))
    setConditionInput('')
  }

  const removeCondition = (value) => {
    const nextConditions = signupForm.existingConditions.filter((item) => item !== value)
    setSignupForm((prev) => ({ ...prev, existingConditions: nextConditions }))
  }

  const onSubmitLogin = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsLoginSubmitted(true)
    if (Object.values(loginValidation).some(Boolean)) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 850))
    const users = JSON.parse(localStorage.getItem('healix_users') || '[]')
    const user = users.find(
      (item) => item.email.toLowerCase() === loginForm.email.toLowerCase() && item.password === loginForm.password,
    )

    if (!user) {
      setSubmitError('Invalid credentials. Please check your email and password.')
      setSubmitting(false)
      return
    }

    if (loginForm.rememberMe) {
      localStorage.setItem('healix_remembered_email', loginForm.email)
    } else {
      localStorage.removeItem('healix_remembered_email')
    }
    localStorage.setItem('healix_active_user', JSON.stringify(user))
    setSubmitting(false)
    navigate('/home')
  }

  const onSubmitSignup = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setIsSignupSubmitted(true)
    if (Object.values(signupValidation).some(Boolean)) return

    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = JSON.parse(localStorage.getItem('healix_users') || '[]')
    const duplicate = users.some((item) => item.email.toLowerCase() === signupForm.email.toLowerCase())
    if (duplicate) {
      setSubmitError('An account with this email already exists.')
      setSubmitting(false)
      return
    }

    localStorage.setItem('healix_users', JSON.stringify([...users, signupForm]))
    setSubmitting(false)
    setLoginForm((prev) => ({ ...prev, email: signupForm.email }))
    onToggleTab('signin')
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-500 to-purple-600 p-10 text-white lg:flex lg:items-center lg:justify-center">
          <div className="absolute -left-14 -top-10 h-48 w-48 rounded-full bg-white/15 blur-sm" />
          <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-cyan-200/20 blur-sm" />
          <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-purple-200/25 blur-sm" />

          <div className="relative z-10 mx-auto flex w-full max-w-md flex-col justify-center gap-6">
            <div>
              <p className="text-3xl font-bold tracking-tight">HealiX</p>
              <p className="mt-2 text-base text-blue-100">Your Health, Simplified</p>
            </div>

            <div className="mx-auto w-full max-w-md rounded-3xl bg-white/15 p-6 backdrop-blur">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80"
                alt="Medical professional"
                className="h-72 w-full rounded-2xl object-cover shadow-lg"
                onError={onHealthImageError}
              />
              <p className="mt-4 text-sm text-blue-50">
                Smart care management for appointments, medicine tracking, and proactive healthcare insights.
              </p>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl sm:p-6">
            <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => onToggleTab('signup')}
                className={`rounded-lg py-2 text-sm font-semibold transition-all duration-300 ${
                  tab === 'signup' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'
                }`}
              >
                Sign Up
              </button>
              <button
                type="button"
                onClick={() => onToggleTab('signin')}
                className={`rounded-lg py-2 text-sm font-semibold transition-all duration-300 ${
                  tab === 'signin' ? 'bg-white text-blue-600 shadow' : 'text-slate-600'
                }`}
              >
                Sign In
              </button>
            </div>

            {tab === 'signin' ? (
              <form onSubmit={onSubmitLogin} className="space-y-4">
                <Field label="Email" error={getLoginError('email')}>
                  <input
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => onLoginChange('email', e.target.value)}
                    onBlur={() => setLoginTouched((prev) => ({ ...prev, email: true }))}
                    className={inputClass(Boolean(getLoginError('email')))}
                    placeholder="name@example.com"
                  />
                </Field>

                <Field label="Password" error={getLoginError('password')}>
                  <div className="relative">
                    <input
                      type={showLoginPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => onLoginChange('password', e.target.value)}
                      onBlur={() => setLoginTouched((prev) => ({ ...prev, password: true }))}
                      className={inputClass(Boolean(getLoginError('password')))}
                      placeholder="Enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500"
                    >
                      {showLoginPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </Field>

                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={loginForm.rememberMe}
                    onChange={(e) => onLoginChange('rememberMe', e.target.checked)}
                  />
                  Remember Me
                </label>

                {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Logging in...' : 'Login'}
                </button>
              </form>
            ) : (
              <form onSubmit={onSubmitSignup} className="space-y-5">
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Full Name" error={getSignupError('fullName')}>
                    <input value={signupForm.fullName} onChange={(e) => onSignupChange('fullName', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, fullName: true }))} className={inputClass(Boolean(getSignupError('fullName')))} />
                  </Field>
                  <Field label="DOB" error={getSignupError('dob')}>
                    <input type="date" value={signupForm.dob} onChange={(e) => onSignupChange('dob', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, dob: true }))} className={inputClass(Boolean(getSignupError('dob')))} />
                  </Field>
                  <Field label="Gender" error={getSignupError('gender')}>
                    <select value={signupForm.gender} onChange={(e) => onSignupChange('gender', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, gender: true }))} className={inputClass(Boolean(getSignupError('gender')))}>
                      <option value="">Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                  <Field label="Phone Number" error={getSignupError('phone')}>
                    <input value={signupForm.phone} onChange={(e) => onSignupChange('phone', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, phone: true }))} className={inputClass(Boolean(getSignupError('phone')))} />
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Aadhar Number" error={getSignupError('aadhar')}>
                    <input value={signupForm.aadhar} onChange={(e) => onSignupChange('aadhar', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, aadhar: true }))} className={inputClass(Boolean(getSignupError('aadhar')))} />
                  </Field>
                  <Field label="ABHA ID" error={getSignupError('abhaId')}>
                    <input value={signupForm.abhaId} onChange={(e) => onSignupChange('abhaId', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, abhaId: true }))} className={inputClass(Boolean(getSignupError('abhaId')))} placeholder="12345678901234 or 1234-5678-9012" />
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Blood Group" error={getSignupError('bloodGroup')}>
                    <select value={signupForm.bloodGroup} onChange={(e) => onSignupChange('bloodGroup', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, bloodGroup: true }))} className={inputClass(Boolean(getSignupError('bloodGroup')))}>
                      <option value="">Select blood group</option>
                      <option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                    </select>
                  </Field>
                  <Field label="Height (cm)" error={getSignupError('height')}>
                    <input value={signupForm.height} onChange={(e) => onSignupChange('height', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, height: true }))} className={inputClass(Boolean(getSignupError('height')))} />
                  </Field>
                  <Field label="Weight (kg)" error={getSignupError('weight')}>
                    <input value={signupForm.weight} onChange={(e) => onSignupChange('weight', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, weight: true }))} className={inputClass(Boolean(getSignupError('weight')))} />
                  </Field>
                  <Field label="Existing Conditions" error={getSignupError('existingConditions')}>
                    <div
                      className={`rounded-lg border bg-white p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-500 ${
                        getSignupError('existingConditions') ? 'border-rose-500' : 'border-slate-300'
                      }`}
                      onBlur={() => setSignupTouched((prev) => ({ ...prev, existingConditions: true }))}
                    >
                      <div className="mb-2 flex flex-wrap gap-2">
                        {signupForm.existingConditions.map((condition) => (
                          <span key={condition} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
                            {condition}
                            <button
                              type="button"
                              onClick={() => removeCondition(condition)}
                              className="text-blue-700 hover:text-blue-900"
                              aria-label={`Remove ${condition}`}
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        value={conditionInput}
                        onChange={(e) => setConditionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            addCondition(conditionInput)
                          }
                        }}
                        placeholder="Type condition and press Enter"
                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-2 flex flex-wrap gap-2">
                        {conditionOptions.map((option) => {
                          const active = signupForm.existingConditions.some(
                            (item) => item.toLowerCase() === option.toLowerCase(),
                          )
                          return (
                            <button
                              key={option}
                              type="button"
                              onClick={() => addCondition(option)}
                              className={`rounded-full border px-2 py-1 text-xs transition ${
                                active
                                  ? 'border-blue-300 bg-blue-100 text-blue-700'
                                  : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </Field>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Emergency Contact Name" error={getSignupError('emergencyName')}>
                    <input value={signupForm.emergencyName} onChange={(e) => onSignupChange('emergencyName', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, emergencyName: true }))} className={inputClass(Boolean(getSignupError('emergencyName')))} />
                  </Field>
                  <Field label="Emergency Contact Number" error={getSignupError('emergencyPhone')}>
                    <input value={signupForm.emergencyPhone} onChange={(e) => onSignupChange('emergencyPhone', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, emergencyPhone: true }))} className={inputClass(Boolean(getSignupError('emergencyPhone')))} />
                  </Field>
                </div>

                <div className="grid gap-3">
                  <Field label="Email" error={getSignupError('email')}>
                    <input type="email" value={signupForm.email} onChange={(e) => onSignupChange('email', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, email: true }))} className={inputClass(Boolean(getSignupError('email')))} />
                  </Field>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Field label="Password" error={getSignupError('password')}>
                    <div className="relative">
                      <input type={showSignupPassword ? 'text' : 'password'} value={signupForm.password} onChange={(e) => onSignupChange('password', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, password: true }))} className={inputClass(Boolean(getSignupError('password')))} />
                      <button type="button" onClick={() => setShowSignupPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{showSignupPassword ? 'Hide' : 'Show'}</button>
                    </div>
                  </Field>
                  <Field label="Confirm Password" error={getSignupError('confirmPassword')}>
                    <div className="relative">
                      <input type={showSignupConfirmPassword ? 'text' : 'password'} value={signupForm.confirmPassword} onChange={(e) => onSignupChange('confirmPassword', e.target.value)} onBlur={() => setSignupTouched((prev) => ({ ...prev, confirmPassword: true }))} className={inputClass(Boolean(getSignupError('confirmPassword')))} />
                      <button type="button" onClick={() => setShowSignupConfirmPassword((prev) => !prev)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">{showSignupConfirmPassword ? 'Hide' : 'Show'}</button>
                    </div>
                  </Field>
                </div>

                {submitError ? <p className="text-sm text-rose-600">{submitError}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default AuthModule

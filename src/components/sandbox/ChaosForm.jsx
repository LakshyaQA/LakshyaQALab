import React, { useState, useEffect, useCallback } from 'react'
import { useNetwork } from '../../context/NetworkContext'
import { useLogger } from '../../context/LoggerContext'

// ─── Constants ─────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['', 'Engineering', 'QA & Testing', 'Product', 'Design', 'DevOps']
const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

const COUNTRY_CODES = [
  { code: '+91', label: 'IN (+91)' },
  { code: '+1', label: 'US (+1)' },
  { code: '+44', label: 'UK (+44)' },
]

const BASE_FIELDS = [
  { id: 'name', label: 'Full Name', swapLabel: 'Email Address', type: 'text', required: true },
  { id: 'email', label: 'Email Address', swapLabel: 'Full Name', type: 'email', required: true },
  { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
  { id: 'dept', label: 'Department', type: 'select', required: true },
  { id: 'priority', label: 'Priority Level', type: 'radio', required: true },
  { id: 'message', label: 'Message', type: 'textarea', required: true },
  { id: 'terms', label: 'I agree to Terms & Conditions', type: 'checkbox', required: true },
]

const VALIDATORS = {
  name: v => (!v.trim() ? 'Full name is required.' : ''),
  email: v =>
    !v.trim()
      ? 'Email is required.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
        ? 'Enter a valid email address.'
        : '',
  phone: v => (v && !/^\+?[\d\s\-()\\.]{7,15}$/.test(v) ? 'Enter a valid phone number.' : ''),
  dept: v => (!v ? 'Please select a department.' : ''),
  priority: v => (!v ? 'Please select a priority level.' : ''),
  message: v =>
    !v.trim()
      ? 'Message is required.'
      : v.trim().length < 10
        ? 'Message must be at least 10 characters.'
        : '',
  terms: v => (!v ? 'You must agree to the terms.' : ''),
  ghost: v =>
    !v.trim()
      ? 'Verification code is required.'
      : v.trim() !== '42'
        ? 'Wrong code. Hint: the answer to everything 🤖'
        : '',
}

// ─── Chaos Toggle Bar ──────────────────────────────────────────────────────────
const CHAOS_TOGGLES = [
  {
    key: 'labelSwap',
    testid: 'chaos-label-swap',
    label: 'Label Swap',
    color: '#f59e0b',
    icon: '🔀',
  },
  {
    key: 'spinner',
    testid: 'chaos-spinner',
    label: 'Infinite Spinner',
    color: '#ef4444',
    icon: '♾️',
  },
  {
    key: 'randomValidation',
    testid: 'chaos-random-validation',
    label: 'Random Validation',
    color: '#8b5cf6',
    icon: '🎲',
  },
  {
    key: 'fieldShuffle',
    testid: 'chaos-field-shuffle',
    label: 'Field Shuffle',
    color: '#06b6d4',
    icon: '🔠',
  },
  {
    key: 'ghostField',
    testid: 'chaos-ghost-field',
    label: 'Ghost Field',
    color: '#64748b',
    icon: '👻',
  },
]

const ChaosToggleBar = ({ chaos, onToggle }) => {
  const anyActive = Object.values(chaos).some(Boolean)
  return (
    <div
      className="mb-6 p-4 rounded-xl border"
      style={{
        background: anyActive ? 'rgba(239,68,68,0.04)' : 'rgba(0,0,0,0.02)',
        borderColor: anyActive ? 'rgba(239,68,68,0.3)' : '#e5e7eb',
      }}
      data-testid="chaos-toggle-bar"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wide">
            Chaos Controls
          </span>
        </div>
        {anyActive && (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full animate-pulse"
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            ⚡ CHAOS ACTIVE
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {CHAOS_TOGGLES.map(t => (
          <label
            key={t.key}
            className="flex items-center gap-2 cursor-pointer group"
            title={`Toggle ${t.label} chaos mode`}
          >
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="sr-only"
                checked={chaos[t.key]}
                onChange={() => onToggle(t.key)}
                data-testid={t.testid}
              />
              <div
                className="w-9 h-5 rounded-full transition-colors"
                style={{ background: chaos[t.key] ? t.color : '#d1d5db' }}
              />
              <div
                className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-sm"
                style={{ transform: chaos[t.key] ? 'translateX(16px)' : 'translateX(0)' }}
              />
            </div>
            <span
              className="text-xs font-semibold transition-colors"
              style={{ color: chaos[t.key] ? t.color : '#6b7280' }}
            >
              {t.icon} {t.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Submission Log ────────────────────────────────────────────────────────────
const SubmissionLog = ({ logs }) => {
  if (logs.length === 0) return null
  const statusStyle = {
    success: { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', badge: '✅ SUCCESS' },
    'chaos-fail': { bg: '#fff7ed', border: '#fcd34d', text: '#d97706', badge: '🎲 CHAOS BLOCKED' },
    stuck: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '♾️ SPINNER STUCK' },
    failed: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '❌ FAILED' },
  }
  return (
    <div className="mt-6" data-testid="chaos-submit-log">
      <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
        Submission Log
      </h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {logs.map((log, i) => {
          const s = statusStyle[log.status] || statusStyle.failed
          return (
            <div
              key={i}
              className="rounded-lg p-2.5 flex items-start gap-3 text-xs font-mono"
              style={{ background: s.bg, border: `1px solid ${s.border}` }}
              data-testid={`chaos-log-entry-${i}`}
            >
              <span className="font-bold flex-shrink-0" style={{ color: s.text }}>
                {s.badge}
              </span>
              <span className="text-gray-500 flex-shrink-0">{log.time}</span>
              {log.detail && <span className="text-gray-600 truncate">{log.detail}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Error Message ─────────────────────────────────────────────────────────────
const FieldError = ({ fieldId, message }) => {
  if (!message) return null
  return (
    <p
      className="mt-1.5 text-xs text-red-500 flex items-center"
      data-testid={`chaos-error-${fieldId}`}
      role="alert"
    >
      <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
      {message}
    </p>
  )
}

// ─── Main Chaos Form ───────────────────────────────────────────────────────────
const ChaosForm = () => {
  const { mockFetch } = useNetwork()
  const { addLog } = useLogger()

  // Form values
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    dept: '',
    priority: '',
    message: '',
    terms: false,
    ghost: '',
  })
  const [errors, setErrors] = useState({})

  // Chaos modes
  const [chaos, setChaos] = useState({
    labelSwap: false,
    spinner: false,
    randomValidation: false,
    fieldShuffle: false,
    ghostField: false,
  })

  const [selectedCountry, setSelectedCountry] = useState('+91')

  // Submit state: idle | loading | success | error
  const [submitState, setSubmitState] = useState('idle')

  // Label swap — swaps every 4s when active
  const [labelSwapped, setLabelSwapped] = useState(false)

  // Field order — array of indices into BASE_FIELDS, shuffled on submit when chaos active
  const [fieldOrder, setFieldOrder] = useState(BASE_FIELDS.map((_, i) => i))

  // Submission log
  const [submitLog, setSubmitLog] = useState([])

  // ── Reset form state when spinner chaos is turned OFF ────────────────────────
  if (!chaos.spinner && submitState === 'loading') {
    setSubmitState('idle')
  }

  // ── Label Swap interval ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!chaos.labelSwap) return
    const iv = setInterval(() => setLabelSwapped(prev => !prev), 4000)
    return () => {
      clearInterval(iv)
      setLabelSwapped(false)
    }
  }, [chaos.labelSwap])

  const toggleChaos = useCallback(
    key => {
      setChaos(prev => {
        const next = { ...prev, [key]: !prev[key] }
        addLog('action', `Chaos Mode: "${key}" turned ${next[key] ? 'ON' : 'OFF'}`)
        return next
      })
    },
    [addLog]
  )

  const shuffleFieldOrder = useCallback(() => {
    setFieldOrder(prev => {
      const arr = [...prev]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    })
  }, [])

  const appendLog = useCallback((status, detail = '') => {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
    setSubmitLog(prev => [{ status, time, detail }, ...prev].slice(0, 10))
  }, [])

  // ── Submit handler ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(
    async e => {
      e.preventDefault()
      if (submitState === 'loading') return

      // Field Shuffle chaos — re-order on every attempt
      if (chaos.fieldShuffle) shuffleFieldOrder()

      // Validate all fields
      const newErrors = {}
      Object.keys(VALIDATORS).forEach(k => {
        if (k === 'ghost') return
        const err = VALIDATORS[k](values[k])
        if (err) newErrors[k] = err
      })
      // Ghost field validation
      if (chaos.ghostField) {
        const err = VALIDATORS.ghost(values.ghost)
        if (err) newErrors.ghost = err
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        appendLog('failed', `${Object.keys(newErrors).length} field(s) invalid`)
        addLog(
          'error',
          `Chaos Form: Submit blocked — validation errors on [${Object.keys(newErrors).join(', ')}]`
        )
        return
      }

      setErrors({})

      // Random Validation chaos — inject a fake server error on a valid field
      if (chaos.randomValidation) {
        const fields = ['name', 'email', 'phone', 'dept', 'priority', 'message']
        const pick = fields[Math.floor(Math.random() * fields.length)]
        setErrors({ [pick]: 'Server validation failed for this field. (chaos mode)' })
        appendLog('chaos-fail', `🎲 Random validation hit → [${pick}]`)
        addLog('error', `Chaos Form: Random validation chaos injected on field "${pick}"`)
        return
      }

      // Infinite Spinner chaos — enter loading state and never resolve
      if (chaos.spinner) {
        setSubmitState('loading')
        appendLog('stuck', '♾️ Infinite spinner — form will not resolve')
        addLog('info', 'Chaos Form: Infinite spinner active — submission stuck')
        return
      }

      // Normal submit — goes through mockFetch (obeys God Mode)
      setSubmitState('loading')
      addLog('request', 'Chaos Form: Submitting to /api/chaos-form')
      try {
        await mockFetch('/api/chaos-form', { values })
        setSubmitState('success')
        appendLog(
          'success',
          `Chaos modes: [${
            Object.keys(chaos)
              .filter(k => chaos[k])
              .join(', ') || 'none'
          }]`
        )
        addLog('info', 'Chaos Form: 200 OK — form submitted successfully')
        // Reset after 3s
        setTimeout(() => {
          setSubmitState('idle')
          setValues({
            name: '',
            email: '',
            phone: '',
            dept: '',
            priority: '',
            message: '',
            terms: false,
            ghost: '',
          })
          setFieldOrder(BASE_FIELDS.map((_, i) => i))
        }, 3000)
      } catch (err) {
        setSubmitState('error')
        appendLog('failed', err.message)
        addLog('error', `Chaos Form: Submit failed — ${err.message}`)
        setTimeout(() => setSubmitState('idle'), 3000)
      }
    },
    [submitState, chaos, values, shuffleFieldOrder, mockFetch, addLog, appendLog]
  )

  const handleChange = useCallback(
    (field, value) => {
      setValues(prev => ({ ...prev, [field]: value }))
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
    },
    [errors]
  )

  // ── Effective label for a field (swaps name/email when chaos active) ─────────
  const getLabel = field => {
    if (!chaos.labelSwap) return field.label
    if (field.id === 'name') return labelSwapped ? (field.swapLabel ?? field.label) : field.label
    if (field.id === 'email') return labelSwapped ? (field.swapLabel ?? field.label) : field.label
    return field.label
  }

  const isLoading = submitState === 'loading'
  const isSuccess = submitState === 'success'
  const isError = submitState === 'error'
  const anyActive = Object.values(chaos).some(Boolean)

  // ── Field renderers ──────────────────────────────────────────────────────────
  const renderField = field => {
    const label = getLabel(field)
    // Accessibility: text-gray-600 is replaced with text-gray-700 for better contrast on white backgrounds
    const inputClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 disabled:opacity-50 ${errors[field.id] ? 'border-red-400' : 'border-gray-300 dark:border-slate-600'}`

    return (
      <div key={field.id}>
        {field.type !== 'checkbox' && (
          <label
            className="block text-xs font-semibold text-gray-700 dark:text-slate-200 mb-1"
            htmlFor={`chaos-input-${field.id}`}
          >
            {label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
            {chaos.labelSwap && (field.id === 'name' || field.id === 'email') && (
              <span
                className="ml-2 text-xs font-mono px-1.5 py-0.5 rounded"
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  color: '#d97706',
                  border: '1px solid rgba(245,158,11,0.3)',
                }}
                title="Label may be swapped by chaos mode — always target by data-testid"
              >
                🔀 swapped?
              </span>
            )}
          </label>
        )}

        {field.type === 'text' || field.type === 'email' ? (
          <input
            id={`chaos-input-${field.id}`}
            type={field.type}
            value={values[field.id]}
            onChange={e => handleChange(field.id, e.target.value)}
            disabled={isLoading}
            placeholder={field.type === 'email' ? 'you@example.com' : 'Enter your full name'}
            className={inputClass}
            data-testid={`chaos-input-${field.id}`}
            aria-invalid={!!errors[field.id]}
          />
        ) : field.type === 'tel' ? (
          <div className="flex gap-2 items-stretch h-[38px]">
            <div className="relative h-full">
              <select
                aria-label="Country Code"
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                disabled={isLoading}
                className="h-full pl-3 pr-8 border border-gray-300 dark:border-slate-600 rounded-lg text-sm bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 appearance-none transition-all"
                data-testid="chaos-phone-country-code"
              >
                {COUNTRY_CODES.map(c => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <input
              id={`chaos-input-${field.id}`}
              type="tel"
              value={values[field.id]}
              onChange={e => handleChange(field.id, e.target.value)}
              disabled={isLoading}
              placeholder="98765 43210"
              className={`${inputClass} !h-full`}
              data-testid={`chaos-input-${field.id}`}
              aria-invalid={!!errors[field.id]}
            />
          </div>
        ) : field.type === 'select' ? (
          <select
            id={`chaos-input-${field.id}`}
            value={values[field.id]}
            onChange={e => handleChange(field.id, e.target.value)}
            disabled={isLoading}
            className={inputClass}
            data-testid="chaos-select-dept"
            aria-invalid={!!errors[field.id]}
          >
            {DEPARTMENTS.map(d => (
              <option key={d} value={d}>
                {d || '— Select department —'}
              </option>
            ))}
          </select>
        ) : field.type === 'radio' ? (
          <div
            className="flex flex-wrap gap-3"
            data-testid="chaos-radio-priority"
            role="radiogroup"
          >
            {PRIORITIES.map(p => (
              <label
                key={p}
                className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-slate-300 group"
                htmlFor={`chaos-radio-${p.toLowerCase()}`}
              >
                <input
                  id={`chaos-radio-${p.toLowerCase()}`}
                  type="radio"
                  name="chaos-priority"
                  value={p}
                  checked={values.priority === p}
                  onChange={() => handleChange('priority', p)}
                  disabled={isLoading}
                  className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 border-gray-300"
                  data-testid={`chaos-radio-${p.toLowerCase()}`}
                />
                <span className="group-hover:text-indigo-600 transition-colors">{p}</span>
              </label>
            ))}
          </div>
        ) : field.type === 'textarea' ? (
          <div className="relative">
            <textarea
              id={`chaos-input-${field.id}`}
              value={values[field.id]}
              onChange={e => handleChange(field.id, e.target.value)}
              disabled={isLoading}
              rows={3}
              maxLength={300}
              placeholder="Describe your request (min. 10 characters)…"
              className={`${inputClass} resize-none`}
              data-testid="chaos-textarea-msg"
              aria-invalid={!!errors[field.id]}
            />
            <span className="absolute bottom-2 right-3 text-xs text-gray-500 dark:text-slate-400 font-mono pointer-events-none">
              {values.message.length}/300
            </span>
          </div>
        ) : field.type === 'checkbox' ? (
          <label
            className="flex items-start gap-2 cursor-pointer group"
            htmlFor={`chaos-input-${field.id}`}
          >
            <input
              id={`chaos-input-${field.id}`}
              type="checkbox"
              checked={values.terms}
              onChange={e => handleChange('terms', e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              data-testid="chaos-checkbox-terms"
              aria-invalid={!!errors.terms}
            />
            <span className="text-sm text-gray-700 dark:text-slate-300 select-none group-hover:text-indigo-600 transition-colors">
              {field.label}
            </span>
          </label>
        ) : null}

        <FieldError fieldId={field.id} message={errors[field.id]} />
      </div>
    )
  }

  // ── Ghost field ──────────────────────────────────────────────────────────────
  const renderGhostField = () => (
    <div
      className="rounded-xl p-4 border"
      style={{
        background: 'rgba(100,116,139,0.06)',
        borderColor: 'rgba(100,116,139,0.3)',
        borderStyle: 'dashed',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">👻</span>
        <label
          htmlFor="chaos-ghost"
          className="text-xs font-bold text-gray-500 dark:text-slate-400"
        >
          Ghost Verification Code <span className="text-red-500">*</span>
        </label>
        <span
          className="text-xs px-1.5 py-0.5 rounded font-mono"
          style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b' }}
        >
          dynamic field
        </span>
      </div>
      <input
        id="chaos-ghost"
        type="text"
        value={values.ghost}
        onChange={e => handleChange('ghost', e.target.value)}
        disabled={isLoading}
        placeholder="Enter secret verification code…"
        className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 transition-colors bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 disabled:opacity-50 ${errors.ghost ? 'border-red-400' : 'border-slate-300 dark:border-slate-500'}`}
        data-testid="chaos-ghost-field-input"
        aria-invalid={!!errors.ghost}
      />
      <FieldError fieldId="ghost" message={errors.ghost} />
      <p className="text-xs text-gray-400 mt-1.5">
        🤖 Can your automation find and fill this dynamically injected field?
      </p>
    </div>
  )

  return (
    <>
      {/* ── Main Card ──────────────────────────────────────────────────────── */}
      <div
        id="chaos-form"
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all duration-300 md:col-span-2 lg:col-span-3"
        style={{ borderColor: anyActive ? 'rgba(239,68,68,0.4)' : '#e5e7eb' }}
        data-testid="chaos-form"
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700 rounded-t-xl"
          style={{
            background: anyActive
              ? 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.03))'
              : 'transparent',
            borderColor: anyActive ? 'rgba(239,68,68,0.2)' : undefined,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{
                background: anyActive
                  ? 'linear-gradient(135deg, #ef4444, #f97316)'
                  : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                boxShadow: anyActive
                  ? '0 3px 12px rgba(239,68,68,0.35)'
                  : '0 3px 12px rgba(99,102,241,0.3)',
              }}
            >
              {anyActive ? '⚡' : '📋'}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Chaos Form Builder
              </h2>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                {anyActive
                  ? `${Object.values(chaos).filter(Boolean).length} chaos mode(s) active — your automation must adapt`
                  : 'Toggle chaos modes to simulate real-world form misbehaviour'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 font-mono">
            <span>[data-testid="chaos-form"]</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6">
          {/* Chaos Toggle Bar */}
          <ChaosToggleBar chaos={chaos} onToggle={toggleChaos} />

          {/* Success Banner */}
          {isSuccess && (
            <div
              className="mb-5 p-4 rounded-xl text-sm text-center font-semibold"
              style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a' }}
              data-testid="chaos-form-success"
              role="alert"
            >
              🎉 Form submitted successfully! All data validated and accepted.
            </div>
          )}

          {/* Network Error Banner */}
          {isError && (
            <div
              className="mb-5 p-3 rounded-xl text-sm text-center"
              style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
              data-testid="chaos-form-error"
              role="alert"
            >
              Network error — check God Mode panel (Force Offline / 500 Error active?)
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Render fields in current order (possibly shuffled) */}
            {fieldOrder.map(idx => {
              const field = BASE_FIELDS[idx]
              // Insert Ghost Field before message (idx 5) when chaos active
              if (field.id === 'message' && chaos.ghostField) {
                return (
                  <React.Fragment key={`ghost-${field.id}`}>
                    {renderGhostField()}
                    {renderField(field)}
                  </React.Fragment>
                )
              }
              return <React.Fragment key={field.id}>{renderField(field)}</React.Fragment>
            })}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              data-testid="chaos-submit-btn"
              aria-busy={isLoading}
              className="w-full text-white font-bold py-3 rounded-xl text-sm transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              style={{
                background: isLoading
                  ? chaos.spinner
                    ? 'linear-gradient(135deg, #ef4444, #f97316)'
                    : '#818cf8'
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: isLoading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>
                    {chaos.spinner ? '♾️ Submitting… (infinite spinner chaos)' : 'Submitting…'}
                  </span>
                </>
              ) : (
                <span>Submit Form {anyActive ? '⚡' : '→'}</span>
              )}
            </button>
          </form>

          {/* Submission Log */}
          <SubmissionLog logs={submitLog} />
        </div>
      </div>
    </>
  )
}

export default ChaosForm

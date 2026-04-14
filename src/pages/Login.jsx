import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import QACursorEffect from '../components/QACursorEffect'
import QAToolsOverlay from '../components/qa/QAToolsOverlay'

// ─── Google reCAPTCHA Test Site Key (always passes – safe for automation) ──────
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

// ─── Constants ─────────────────────────────────────────────────────────────────
const USERNAME_MAX = 14
const PASSWORD_MIN = 8
const PASSWORD_MAX = 16
const MAX_ATTEMPTS = 5
const LOCKOUT_SECONDS = 30

// ─── Validators ────────────────────────────────────────────────────────────────
const validateUsername = val => {
  const trimmed = val.trim()
  if (!trimmed) return 'Username is required.'
  if (trimmed.length > USERNAME_MAX) return `Max ${USERNAME_MAX} characters allowed.`
  if (/^[0-9]+$/.test(trimmed))
    return 'Username cannot be numbers only. Use a combination of letters and numbers.'
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) return 'Username cannot contain only special symbols.'
  if (/[<>"'`]/.test(trimmed)) return 'Username contains invalid characters.'
  return ''
}

const validatePassword = val => {
  if (!val) return "Password can't be empty."
  if (val.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`
  if (val.length > PASSWORD_MAX) return `Max ${PASSWORD_MAX} characters allowed.`
  if (!/[A-Z]/.test(val)) return 'Must include at least 1 uppercase letter.'
  if (!/[0-9]/.test(val)) return 'Must include at least 1 number.'
  if (!/[^a-zA-Z0-9]/.test(val)) return 'Must include at least 1 special symbol (e.g. @, #, !).'
  return ''
}

// ─── Theme Toggle Button ───────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    data-testid="theme-toggle"
    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Matrix Mode'}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      position: 'fixed',
      top: 20,
      right: 20,
      zIndex: 55,
      width: 40,
      height: 40,
      borderRadius: '50%',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDark ? 'rgba(15,23,42,0.8)' : '#ffffff',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: 18,
      boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.25s ease',
    }}
  >
    {isDark ? '☀️' : '🌙'}
  </button>
)

// ─── Main Login Component ──────────────────────────────────────────────────────
const Login = () => {
  useEffect(() => {
    document.title = 'Login | LakshyaQALab'
  }, [])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Field-level errors (real-time)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [usernameHasBlurred, setUsernameHasBlurred] = useState(false)
  const [passwordHasBlurred, setPasswordHasBlurred] = useState(false)

  // Auth
  const [globalError, setGlobalError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockoutUntil, setLockoutUntil] = useState(null)
  const [lockoutRemaining, setLockoutRemaining] = useState(0)

  // Theme: 'light' (default) | 'dark' (matrix)
  const [isDarkTheme, _setIsDarkTheme] = useState(false)

  // reCAPTCHA
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaError, setCaptchaError] = useState('')
  const recaptchaContainerRef = useRef(null)
  const widgetIdRef = useRef(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const renderWidget = useCallback(() => {
    if (!recaptchaContainerRef.current) return
    if (widgetIdRef.current !== null) return // already rendered

    if (window.grecaptcha && window.grecaptcha.render) {
      try {
        widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
          sitekey: RECAPTCHA_SITE_KEY,
          theme: 'light',
          callback: () => {
            setCaptchaVerified(true)
            setCaptchaError('')
          },
          'expired-callback': () => {
            setCaptchaVerified(false)
          },
          'error-callback': () => {
            setCaptchaVerified(false)
          },
        })
      } catch {
        // Widget may already exist if HMR fired twice — ignore
      }
    }
  }, [])

  // ── Load reCAPTCHA script ──────────────────────────────────────────────────
  useEffect(() => {
    const SCRIPT_ID = 'recaptcha-script'
    if (document.getElementById(SCRIPT_ID)) {
      renderWidget()
      return
    }

    window.__recaptchaReady = () => renderWidget()

    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = 'https://www.google.com/recaptcha/api.js?onload=__recaptchaReady&render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    return () => {
      // Don't remove script — keep for hot-reload resilience
    }
  }, [renderWidget])

  // Expose global so script callback works
  useEffect(() => {
    window.__recaptchaReady = renderWidget
  }, [renderWidget])

  // ── Lockout countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!lockoutUntil) return
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setLockoutUntil(null)
        setLockoutRemaining(0)
        setFailedAttempts(0)
        setGlobalError('')
      } else {
        setLockoutRemaining(remaining)
      }
    }, 500)
    return () => clearInterval(interval)
  }, [lockoutUntil])

  // ── Field handlers ─────────────────────────────────────────────────────────
  const handleUsernameChange = useCallback(
    e => {
      const val = e.target.value
      if (val.length > USERNAME_MAX) return
      setUsername(val)
      if (usernameHasBlurred) setUsernameError(validateUsername(val))
    },
    [usernameHasBlurred]
  )

  const handleUsernameBlur = useCallback(() => {
    setUsernameHasBlurred(true)
    setUsernameError(validateUsername(username))
  }, [username])

  const handlePasswordChange = useCallback(
    e => {
      const val = e.target.value
      if (val.length > PASSWORD_MAX) {
        setPasswordError(`Max ${PASSWORD_MAX} characters allowed.`)
        return
      }
      setPassword(val)
      if (passwordHasBlurred) setPasswordError(validatePassword(val))
    },
    [passwordHasBlurred]
  )

  const handlePasswordBlur = useCallback(() => {
    setPasswordHasBlurred(true)
    setPasswordError(validatePassword(password))
  }, [password])

  const handlePasswordClear = useCallback(() => {
    if (password.length > 0 && passwordHasBlurred) {
      setPasswordError("Password can't be empty.")
    }
  }, [password, passwordHasBlurred])

  const _isFormValid = !validateUsername(username) && !validatePassword(password)
  const isLocked = !!lockoutUntil && lockoutRemaining > 0

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async e => {
    e.preventDefault()
    setGlobalError('')
    setCaptchaError('')

    if (isLocked) return

    // Captcha gate
    if (!captchaVerified) {
      setCaptchaError('Please complete the reCAPTCHA verification.')
      return
    }

    // Final field validation
    const uErr = validateUsername(username)
    const pErr = validatePassword(password)
    setUsernameError(uErr)
    setPasswordError(pErr)
    setUsernameHasBlurred(true)
    setPasswordHasBlurred(true)
    if (uErr || pErr) return

    setIsLoading(true)
    try {
      const result = await login(username.trim(), password, rememberMe)
      setIsLoading(false)
      if (result.success) {
        navigate('/dashboard')
      } else {
        const newAttempts = failedAttempts + 1
        setFailedAttempts(newAttempts)
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_SECONDS * 1000)
          setGlobalError(`Too many failed attempts. Account locked for ${LOCKOUT_SECONDS} seconds.`)
        } else {
          setGlobalError(
            `Invalid username or password. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`
          )
        }
        // Reset captcha on failed attempt
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current)
          setCaptchaVerified(false)
        }
      }
    } catch {
      setIsLoading(false)
      setGlobalError('Unable to connect. Please try again.')
    }
  }

  // ── Theme-aware styles ─────────────────────────────────────────────────────
  const bg = isDarkTheme
    ? { background: 'linear-gradient(135deg, #020617 0%, #0c1222 50%, #020617 100%)' }
    : { background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)' }

  const cardStyle = isDarkTheme
    ? {
        background: 'rgba(15,23,42,0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(99,102,241,0.25)',
        boxShadow: '0 0 40px rgba(99,102,241,0.12), 0 25px 50px rgba(0,0,0,0.5)',
      }
    : {
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 6px rgba(0,0,0,0.04), 0 20px 40px rgba(99,102,241,0.08)',
      }

  const labelColor = isDarkTheme ? '#94a3b8' : '#374151'
  const inputBg = isDarkTheme ? 'rgba(15,23,42,0.7)' : '#f9fafb'
  const inputBorder = isDarkTheme ? '#334155' : '#d1d5db'
  const inputColor = isDarkTheme ? '#f1f5f9' : '#111827'
  const inputPhColor = isDarkTheme ? '#475569' : '#9ca3af'
  const subtextColor = isDarkTheme ? '#475569' : '#6b7280'
  const titleColor = isDarkTheme ? '#f1f5f9' : '#111827'

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-500"
      style={bg}
    >
      <QAToolsOverlay />

      {/* ── Card ── */}
      <div
        className="max-w-md w-full rounded-2xl p-8 transition-all duration-500"
        style={{ position: 'relative', zIndex: 10, ...cardStyle }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: isDarkTheme
                ? '0 4px 20px rgba(99,102,241,0.5)'
                : '0 4px 14px rgba(99,102,241,0.3)',
            }}
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: titleColor }}>
            QA Playground Login
          </h1>
          <p className="mt-1 text-sm" style={{ color: subtextColor }}>
            Enter credentials to access the sandbox
          </p>
        </div>

        {/* Rate Limiting / Lockout Banner */}
        {isLocked && (
          <div
            className="mb-5 p-4 rounded-xl text-sm text-center"
            style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c' }}
            data-testid="lockout-banner"
            role="alert"
            aria-live="assertive"
          >
            <svg
              className="w-5 h-5 mx-auto mb-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <p className="font-semibold">Account Temporarily Locked</p>
            <p className="mt-1">
              Too many failed attempts. Try again in{' '}
              <span className="font-bold font-mono" data-testid="lockout-timer">
                {lockoutRemaining}s
              </span>
              .
            </p>
          </div>
        )}

        {/* Global Auth Error */}
        {globalError && !isLocked && (
          <div
            className="mb-5 p-3 rounded-xl text-sm text-center"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
            data-testid="login-error"
            role="alert"
            aria-live="polite"
          >
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Username */}
          <div>
            <div className="flex justify-between mb-1">
              <label
                className="text-sm font-medium"
                style={{ color: labelColor }}
                htmlFor="username"
              >
                Username
              </label>
              <span
                className={`text-xs font-mono tabular-nums ${username.length >= USERNAME_MAX ? 'text-red-500' : ''}`}
                style={{ color: username.length >= USERNAME_MAX ? '#ef4444' : subtextColor }}
                aria-live="polite"
              >
                {username.length}/{USERNAME_MAX}
              </span>
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={handleUsernameBlur}
              maxLength={USERNAME_MAX}
              autoComplete="username"
              disabled={isLocked}
              placeholder="e.g. admin or john99"
              aria-invalid={!!usernameError}
              aria-describedby="username-error"
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
              style={{
                background: inputBg,
                borderColor: usernameError ? '#ef4444' : inputBorder,
                color: inputColor,
                focusRingColor: '#6366f1',
              }}
              data-testid="login-username"
            />
            {usernameError && (
              <p
                id="username-error"
                className="mt-1.5 text-xs text-red-500 flex items-center"
                data-testid="username-error-msg"
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {usernameError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label
                className="text-sm font-medium"
                style={{ color: labelColor }}
                htmlFor="password"
              >
                Password
              </label>
              <span
                className="text-xs font-mono tabular-nums"
                style={{ color: password.length >= PASSWORD_MAX ? '#ef4444' : subtextColor }}
                aria-live="polite"
              >
                {password.length}/{PASSWORD_MAX}
              </span>
            </div>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                onInput={handlePasswordClear}
                maxLength={PASSWORD_MAX}
                autoComplete="current-password"
                disabled={isLocked}
                placeholder="Min 8 chars, 1 uppercase, 1 number, 1 symbol"
                aria-invalid={!!passwordError}
                aria-describedby="password-error"
                className="w-full px-4 py-2.5 pr-12 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:opacity-50"
                style={{
                  background: inputBg,
                  borderColor: passwordError ? '#ef4444' : inputBorder,
                  color: inputColor,
                }}
                data-testid="login-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: subtextColor }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                data-testid="password-toggle"
                tabIndex={0}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p
                id="password-error"
                className="mt-1.5 text-xs text-red-500 flex items-center"
                data-testid="password-error-msg"
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember_me"
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              disabled={isLocked}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              data-testid="login-remember-me"
            />
            <label
              htmlFor="remember_me"
              className="ml-2 text-sm cursor-pointer select-none"
              style={{ color: subtextColor }}
            >
              Remember me{' '}
              <span className="text-xs" style={{ color: inputPhColor }}>
                (localStorage vs sessionStorage)
              </span>
            </label>
          </div>

          {/* ── reCAPTCHA (Google Test Key — always passes) ── */}
          <div>
            <div
              ref={recaptchaContainerRef}
              id="recaptcha-container"
              data-testid="recaptcha-widget"
              style={{ display: 'flex', justifyContent: 'center' }}
            />
            {captchaError && (
              <p
                className="mt-1.5 text-xs text-red-500 flex items-center justify-center"
                data-testid="captcha-error-msg"
                role="alert"
              >
                <svg
                  className="w-3.5 h-3.5 mr-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {captchaError}
              </p>
            )}
            <p className="text-center mt-2" style={{ fontSize: 10, color: inputPhColor }}>
              🔒 Testing reCAPTCHA v2 (test key — always passes automation)
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || isLocked}
            className="w-full text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mt-2"
            style={{
              background:
                isLoading || isLocked ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: isLoading || isLocked ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
            }}
            data-testid="login-submit"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Authenticating…</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        {/* Test Credentials — hidden in production */}
        {import.meta.env.DEV && (
          <div
            className="mt-6 text-center text-sm pt-5"
            style={{ borderTop: `1px solid ${isDarkTheme ? 'rgba(99,102,241,0.15)' : '#f1f5f9'}` }}
            data-testid="test-credentials"
          >
            <p
              className="text-xs uppercase tracking-wide mb-2 font-semibold"
              style={{ color: '#6366f1', letterSpacing: '0.1em' }}
            >
              DEV ONLY — Test Credentials
            </p>
            <p
              className="font-mono inline-block px-3 py-1.5 rounded-lg text-sm"
              style={{
                background: isDarkTheme ? 'rgba(79,70,229,0.1)' : '#eef2ff',
                border: '1px solid rgba(99,102,241,0.25)',
                color: isDarkTheme ? '#a5b4fc' : '#4f46e5',
              }}
            >
              admin / Qwerty@1234
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

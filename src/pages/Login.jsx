import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TestScenariosPanel from '../components/sandbox/TestScenariosPanel';
import QACursorEffect from '../components/QACursorEffect';

// ─── Google reCAPTCHA Test Site Key (always passes – safe for automation) ──────
const RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

// ─── Acceptance Criteria ───────────────────────────────────────────────────────
const ACCEPTANCE_CRITERIA = [
  {
    section: '1. Page Load & UI Rendering',
    items: [
      'Page loads without errors. All fields visible: Username, Password, Remember Me, Sign In button.',
      'Responsive layout on Desktop (≥1024px), Tablet (768–1023px), Mobile (≤767px).',
    ],
  },
  {
    section: '2. Username Field Validation',
    items: [
      'Username is mandatory. Empty submit shows: "Username is required".',
      'Must be an alphanumeric combination (not only numbers, not only symbols).',
      'Max 14 characters. Warning shown on limit breach.',
      'No HTML / script injection allowed. Leading/trailing spaces trimmed.',
      'Pure number-only or symbol-only usernames are rejected.',
    ],
  },
  {
    section: '3. Password Field Validation',
    items: [
      "Password is mandatory. Empty submit or clear after fill shows: \"Password can't be empty\".",
      'Min 8, max 16 characters. Shows warning on limit breach.',
      'Must contain at least: 1 uppercase letter, 1 number, 1 special symbol.',
      'Input is masked (●●●●). Show/hide toggle supported.',
      'Inline warning on invalid format: "Must include 1 uppercase, 1 number, 1 symbol".',
    ],
  },
  {
    section: '4. Authentication Logic',
    items: [
      'Valid credentials → redirect to /dashboard.',
      'Invalid credentials → generic error (does not reveal which field is wrong).',
      'Error: "Invalid username or password."',
    ],
  },
  {
    section: '5. Remember Me Functionality',
    items: [
      'Checked → session persists in localStorage.',
      'Unchecked → session in sessionStorage, cleared on browser close.',
      'On reload: if remembered → stays logged in, otherwise → login page shown.',
    ],
  },
  {
    section: '6. Security Requirements',
    items: [
      'Password never appears in plain text or browser logs.',
      'Inputs sanitized against XSS and injection attacks.',
      'After 5 consecutive failed attempts → temporary 30-second lockout (rate limiting).',
      'Lockout countdown timer displayed to user.',
      'No stack traces exposed to end user.',
    ],
  },
  {
    section: '7. UI/UX Behavior',
    items: [
      'Sign In button disabled until both fields have values.',
      'Loading indicator shown during authentication.',
      'Error messages are clear, actionable, and user-friendly.',
      'Tab navigation works correctly (keyboard accessible).',
    ],
  },
  {
    section: '8. Accessibility (A11Y)',
    items: [
      'All form fields have proper <label> associations.',
      'Keyboard-only navigation supported (Tab/Shift+Tab/Enter).',
      'ARIA attributes used: aria-invalid, aria-describedby, aria-live.',
      'Contrast ratio meets WCAG AA standards.',
      'Screen reader compatible.',
    ],
  },
  {
    section: '9. Test Credentials Section',
    items: [
      'Credentials clearly visible in the UI for testing convenience.',
      'Must NOT appear in production builds (controlled by NODE_ENV).',
    ],
  },
  {
    section: '10. Error Handling',
    items: [
      'Network failure → "Unable to connect. Please try again."',
      'Server error → "Something went wrong. Please try later."',
      'No technical error details or stack traces exposed to user.',
    ],
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────
const USERNAME_MAX     = 14;
const PASSWORD_MIN     = 8;
const PASSWORD_MAX     = 16;
const MAX_ATTEMPTS     = 5;
const LOCKOUT_SECONDS  = 30;

// ─── Validators ────────────────────────────────────────────────────────────────
const validateUsername = (val) => {
  const trimmed = val.trim();
  if (!trimmed) return 'Username is required.';
  if (trimmed.length > USERNAME_MAX) return `Max ${USERNAME_MAX} characters allowed.`;
  if (/^[0-9]+$/.test(trimmed)) return 'Username cannot be numbers only. Use a combination of letters and numbers.';
  if (/^[^a-zA-Z0-9]+$/.test(trimmed)) return 'Username cannot contain only special symbols.';
  if (/[<>"'`]/.test(trimmed)) return 'Username contains invalid characters.';
  return '';
};

const validatePassword = (val) => {
  if (!val) return "Password can't be empty.";
  if (val.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (val.length > PASSWORD_MAX) return `Max ${PASSWORD_MAX} characters allowed.`;
  if (!/[A-Z]/.test(val)) return 'Must include at least 1 uppercase letter.';
  if (!/[0-9]/.test(val)) return 'Must include at least 1 number.';
  if (!/[^a-zA-Z0-9]/.test(val)) return 'Must include at least 1 special symbol (e.g. @, #, !).';
  return '';
};

// ─── Portfolio Popup ───────────────────────────────────────────────────────────
const PortfolioPopup = () => {
  const [visible, setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show after 2.5s on every page load
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleVisit = () => {
    window.open('https://lakshyasharmaqa.vercel.app/', '_blank', 'noopener,noreferrer');
    setDismissed(true);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  if (!visible || dismissed) return null;

  return (
    <div
      data-testid="portfolio-popup"
      style={{
        position: 'fixed',
        bottom: 140,
        left: 24,
        zIndex: 60,
        width: 280,
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: 16,
        boxShadow: '0 8px 32px rgba(99,102,241,0.15), 0 2px 8px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        animation: 'portfolio-popup-in 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      }}
    >
      <style>{`
        @keyframes portfolio-popup-in {
          from { opacity: 0; transform: translateY(20px) scale(0.9); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Gradient top bar */}
      <div style={{
        height: 4,
        background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #0ea5e9)',
      }} />

      {/* Content */}
      <div style={{ padding: '14px 16px 12px' }}>
        {/* Close button */}
        <button
          onClick={handleDismiss}
          data-testid="portfolio-popup-close"
          aria-label="Dismiss"
          style={{
            position: 'absolute', top: 10, right: 10,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', padding: 2, lineHeight: 1,
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Avatar + message */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            👋
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#0f172a', lineHeight: 1.3 }}>
              Hey there, QA explorer!
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>
              Want to check out <strong style={{ color: '#4f46e5' }}>Lakshay's full portfolio</strong>? Built with all the QA love. 🚀
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleVisit}
            data-testid="portfolio-popup-visit"
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          >
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Show me!
          </button>
          <button
            onClick={handleDismiss}
            data-testid="portfolio-popup-dismiss"
            style={{
              padding: '8px 12px', borderRadius: 8, cursor: 'pointer',
              background: 'transparent', border: '1px solid #e2e8f0',
              color: '#64748b', fontWeight: 600, fontSize: 12,
            }}
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Acceptance Criteria Modal ─────────────────────────────────────────────────
const ACModal = ({ onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
          e.preventDefault();
          (e.shiftKey ? last : first).focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.querySelector('button')?.focus();
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Acceptance Criteria">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      <div ref={modalRef} className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col" data-testid="ac-modal">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
            </span>
            <div>
              <h2 className="text-gray-900 font-bold text-lg">Acceptance Criteria</h2>
              <p className="text-gray-500 text-xs">Login Page — QA Playground</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded" aria-label="Close" data-testid="ac-modal-close">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {ACCEPTANCE_CRITERIA.map((group, gi) => (
            <div key={gi}>
              <h3 className="text-indigo-600 font-semibold text-sm uppercase tracking-wide mb-3">{group.section}</h3>
              <ul className="space-y-2">
                {group.items.map((item, ii) => (
                  <li key={ii} className="flex items-start space-x-2 text-gray-600 text-sm">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex-shrink-0 bg-slate-50 rounded-b-2xl">
          <p className="text-xs text-slate-400 text-center">These criteria are for QA reference only and must not appear in production.</p>
        </div>
      </div>
    </div>
  );
};

// ─── Theme Toggle Button ───────────────────────────────────────────────────────
const ThemeToggle = ({ isDark, onToggle }) => (
  <button
    onClick={onToggle}
    data-testid="theme-toggle"
    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Matrix Mode'}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    style={{
      position: 'fixed', top: 20, right: 20, zIndex: 55,
      width: 40, height: 40, borderRadius: '50%',
      border: isDark ? '1px solid #334155' : '1px solid #e2e8f0',
      background: isDark ? 'rgba(15,23,42,0.8)' : '#ffffff',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', fontSize: 18,
      boxShadow: isDark
        ? '0 2px 8px rgba(0,0,0,0.4)'
        : '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.25s ease',
    }}
  >
    {isDark ? '☀️' : '🌙'}
  </button>
);

// ─── Main Login Component ──────────────────────────────────────────────────────
const Login = () => {
  useEffect(() => {
    document.title = "Login | LakshyaQALab";
  }, []);

  const [username, setUsername]           = useState('');
  const [password, setPassword]           = useState('');
  const [rememberMe, setRememberMe]       = useState(false);
  const [showPassword, setShowPassword]   = useState(false);

  // Field-level errors (real-time)
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameHasBlurred, setUsernameHasBlurred] = useState(false);
  const [passwordHasBlurred, setPasswordHasBlurred] = useState(false);

  // Auth
  const [globalError, setGlobalError] = useState('');
  const [isLoading, setIsLoading]     = useState(false);

  // Rate limiting
  const [failedAttempts, setFailedAttempts]   = useState(0);
  const [lockoutUntil, setLockoutUntil]       = useState(null);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // AC Modal
  const [showAC, setShowAC] = useState(false);

  // Theme: 'light' (default) | 'dark' (matrix)
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // reCAPTCHA
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError]       = useState('');
  const recaptchaContainerRef = useRef(null);
  const widgetIdRef           = useRef(null);

  const { login } = useAuth();
  const navigate  = useNavigate();

  // ── Load reCAPTCHA script ──────────────────────────────────────────────────
  useEffect(() => {
    const SCRIPT_ID = 'recaptcha-script';
    if (document.getElementById(SCRIPT_ID)) {
      renderWidget();
      return;
    }

    window.__recaptchaReady = () => renderWidget();

    const script = document.createElement('script');
    script.id    = SCRIPT_ID;
    script.src   = 'https://www.google.com/recaptcha/api.js?onload=__recaptchaReady&render=explicit';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Don't remove script — keep for hot-reload resilience
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderWidget = () => {
    if (!recaptchaContainerRef.current) return;
    if (widgetIdRef.current !== null) return; // already rendered

    if (window.grecaptcha && window.grecaptcha.render) {
      try {
        widgetIdRef.current = window.grecaptcha.render(recaptchaContainerRef.current, {
          sitekey:            RECAPTCHA_SITE_KEY,
          theme:              'light',
          callback:           ()  => { setCaptchaVerified(true);  setCaptchaError(''); },
          'expired-callback': ()  => { setCaptchaVerified(false); },
          'error-callback':   ()  => { setCaptchaVerified(false); },
        });
      } catch (_e) {
        // Widget may already exist if HMR fired twice — ignore
      }
    }
  };

  // Expose global so script callback works
  useEffect(() => {
    window.__recaptchaReady = renderWidget;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Lockout countdown ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!lockoutUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockoutUntil(null);
        setLockoutRemaining(0);
        setFailedAttempts(0);
        setGlobalError('');
      } else {
        setLockoutRemaining(remaining);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // ── Field handlers ─────────────────────────────────────────────────────────
  const handleUsernameChange = useCallback((e) => {
    const val = e.target.value;
    if (val.length > USERNAME_MAX) return;
    setUsername(val);
    if (usernameHasBlurred) setUsernameError(validateUsername(val));
  }, [usernameHasBlurred]);

  const handleUsernameBlur = useCallback(() => {
    setUsernameHasBlurred(true);
    setUsernameError(validateUsername(username));
  }, [username]);

  const handlePasswordChange = useCallback((e) => {
    const val = e.target.value;
    if (val.length > PASSWORD_MAX) {
      setPasswordError(`Max ${PASSWORD_MAX} characters allowed.`);
      return;
    }
    setPassword(val);
    if (passwordHasBlurred) setPasswordError(validatePassword(val));
  }, [passwordHasBlurred]);

  const handlePasswordBlur = useCallback(() => {
    setPasswordHasBlurred(true);
    setPasswordError(validatePassword(password));
  }, [password]);

  const handlePasswordClear = useCallback(() => {
    if (password.length > 0 && passwordHasBlurred) {
      setPasswordError("Password can't be empty.");
    }
  }, [password, passwordHasBlurred]);

  const isFormValid = !validateUsername(username) && !validatePassword(password);
  const isLocked    = !!lockoutUntil && lockoutRemaining > 0;

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGlobalError('');
    setCaptchaError('');

    if (isLocked) return;

    // Captcha gate
    if (!captchaVerified) {
      setCaptchaError('Please complete the reCAPTCHA verification.');
      return;
    }

    // Final field validation
    const uErr = validateUsername(username);
    const pErr = validatePassword(password);
    setUsernameError(uErr);
    setPasswordError(pErr);
    setUsernameHasBlurred(true);
    setPasswordHasBlurred(true);
    if (uErr || pErr) return;

    setIsLoading(true);
    try {
      const result = await login(username.trim(), password, rememberMe);
      setIsLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= MAX_ATTEMPTS) {
          setLockoutUntil(Date.now() + LOCKOUT_SECONDS * 1000);
          setGlobalError(`Too many failed attempts. Account locked for ${LOCKOUT_SECONDS} seconds.`);
        } else {
          setGlobalError(`Invalid username or password. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`);
        }
        // Reset captcha on failed attempt
        if (window.grecaptcha && widgetIdRef.current !== null) {
          window.grecaptcha.reset(widgetIdRef.current);
          setCaptchaVerified(false);
        }
      }
    } catch {
      setIsLoading(false);
      setGlobalError('Unable to connect. Please try again.');
    }
  };

  // ── Theme-aware styles ─────────────────────────────────────────────────────
  const bg = isDarkTheme
    ? { background: 'linear-gradient(135deg, #020617 0%, #0c1222 50%, #020617 100%)' }
    : { background: 'linear-gradient(145deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)' };

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
      };

  const labelColor    = isDarkTheme ? '#94a3b8' : '#374151';
  const inputBg       = isDarkTheme ? 'rgba(15,23,42,0.7)' : '#f9fafb';
  const inputBorder   = isDarkTheme ? '#334155' : '#d1d5db';
  const inputColor    = isDarkTheme ? '#f1f5f9' : '#111827';
  const inputPhColor  = isDarkTheme ? '#475569' : '#9ca3af';
  const subtextColor  = isDarkTheme ? '#475569' : '#6b7280';
  const titleColor    = isDarkTheme ? '#f1f5f9' : '#111827';

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12 transition-all duration-500"
      style={bg}
    >
      {/* ── QA Cursor Effect — always disableTooltips on login page ── */}
      <QACursorEffect lightMode={!isDarkTheme} disableTooltips={false} />

      {/* ── Theme Toggle ── */}
      <ThemeToggle isDark={isDarkTheme} onToggle={() => setIsDarkTheme(d => !d)} />

      {/* ── Test Scenarios Panel ── */}
      <TestScenariosPanel />

      {/* ── Portfolio Popup ── */}
      <PortfolioPopup />

      {/* ── Floating AC Button ── */}
      <button
        onClick={() => setShowAC(true)}
        className="fixed bottom-6 right-6 flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-full shadow-lg transition-all duration-200 hover:scale-105 z-50"
        aria-label="View Acceptance Criteria"
        data-testid="ac-open-btn"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        <span className="text-sm font-semibold">Acceptance Criteria</span>
      </button>

      {/* ── AC Modal ── */}
      {showAC && <ACModal onClose={() => setShowAC(false)} />}

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
              boxShadow: isDarkTheme ? '0 4px 20px rgba(99,102,241,0.5)' : '0 4px 14px rgba(99,102,241,0.3)',
            }}
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold" style={{ color: titleColor }}>QA Playground Login</h1>
          <p className="mt-1 text-sm" style={{ color: subtextColor }}>Enter credentials to access the sandbox</p>
        </div>

        {/* Rate Limiting / Lockout Banner */}
        {isLocked && (
          <div
            className="mb-5 p-4 rounded-xl text-sm text-center"
            style={{ background: '#fff7ed', border: '1px solid #fed7aa', color: '#c2410c' }}
            data-testid="lockout-banner" role="alert" aria-live="assertive"
          >
            <svg className="w-5 h-5 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p className="font-semibold">Account Temporarily Locked</p>
            <p className="mt-1">Too many failed attempts. Try again in <span className="font-bold font-mono" data-testid="lockout-timer">{lockoutRemaining}s</span>.</p>
          </div>
        )}

        {/* Global Auth Error */}
        {globalError && !isLocked && (
          <div
            className="mb-5 p-3 rounded-xl text-sm text-center"
            style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }}
            data-testid="login-error" role="alert" aria-live="polite"
          >
            {globalError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Username */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium" style={{ color: labelColor }} htmlFor="username">Username</label>
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
              <p id="username-error" className="mt-1.5 text-xs text-red-500 flex items-center" data-testid="username-error-msg" role="alert">
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                {usernameError}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-sm font-medium" style={{ color: labelColor }} htmlFor="password">Password</label>
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
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
            {passwordError && (
              <p id="password-error" className="mt-1.5 text-xs text-red-500 flex items-center" data-testid="password-error-msg" role="alert">
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
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
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLocked}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              data-testid="login-remember-me"
            />
            <label htmlFor="remember_me" className="ml-2 text-sm cursor-pointer select-none" style={{ color: subtextColor }}>
              Remember me <span className="text-xs" style={{ color: inputPhColor }}>(localStorage vs sessionStorage)</span>
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
              <p className="mt-1.5 text-xs text-red-500 flex items-center justify-center" data-testid="captcha-error-msg" role="alert">
                <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
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
              background: isLoading || isLocked ? '#818cf8' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              boxShadow: isLoading || isLocked ? 'none' : '0 4px 14px rgba(99,102,241,0.4)',
            }}
            data-testid="login-submit"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
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
            <p className="text-xs uppercase tracking-wide mb-2 font-semibold" style={{ color: '#6366f1', letterSpacing: '0.1em' }}>
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
  );
};

export default Login;

import React, { useState, useEffect, useCallback } from 'react';
import { useNetwork } from '../../context/NetworkContext';
import { useLogger } from '../../context/LoggerContext';

// ─── Constants ─────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['', 'Engineering', 'QA & Testing', 'Product', 'Design', 'DevOps'];
const PRIORITIES  = ['Low', 'Medium', 'High', 'Critical'];

const BASE_FIELDS = [
  { id: 'name',     label: 'Full Name',      swapLabel: 'Email Address', type: 'text',     required: true },
  { id: 'email',    label: 'Email Address',  swapLabel: 'Full Name',     type: 'email',    required: true },
  { id: 'phone',    label: 'Phone Number',   type: 'tel',                                  required: false },
  { id: 'dept',     label: 'Department',     type: 'select',                               required: true },
  { id: 'priority', label: 'Priority Level', type: 'radio',                                required: true },
  { id: 'message',  label: 'Message',        type: 'textarea',                             required: true },
  { id: 'terms',    label: 'I agree to Terms & Conditions', type: 'checkbox',              required: true },
];

const VALIDATORS = {
  name:     (v) => !v.trim() ? 'Full name is required.' : '',
  email:    (v) => !v.trim() ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Enter a valid email address.' : '',
  phone:    (v) => v && !/^\+?[\d\s\-()\\.]{7,15}$/.test(v) ? 'Enter a valid phone number.' : '',
  dept:     (v) => !v ? 'Please select a department.' : '',
  priority: (v) => !v ? 'Please select a priority level.' : '',
  message:  (v) => !v.trim() ? 'Message is required.' : v.trim().length < 10 ? 'Message must be at least 10 characters.' : '',
  terms:    (v) => !v ? 'You must agree to the terms.' : '',
  ghost:    (v) => !v.trim() ? "Verification code is required." : v.trim() !== '42' ? "Wrong code. Hint: the answer to everything 🤖" : '',
};

// ─── Chaos Scenarios ───────────────────────────────────────────────────────────
const CHAOS_SCENARIOS = [
  {
    id: 'CS-001', priority: 'P0', tag: 'baseline', icon: '✅', category: 'Baseline',
    title: 'Happy Path — No Chaos',
    steps: [
      'Ensure all chaos toggles are OFF',
      'Fill: name="John99", email="john@test.com", phone="9876543210"',
      'Select dept="QA & Testing", priority="High"',
      'Enter message with ≥10 chars, check Terms',
      'Click [data-testid="chaos-submit-btn"]',
      'Assert [data-testid="chaos-form-success"] is visible',
    ],
  },
  {
    id: 'CS-002', priority: 'P0', tag: 'chaos', icon: '🔀', category: 'Label Swap',
    title: 'Label Swap — Target by data-testid, not label text',
    steps: [
      'Toggle ON [data-testid="chaos-label-swap"]',
      'Wait 4s — assert visual labels swap, but data-testid stays identical',
      'Fill [data-testid="chaos-input-name"] with "John99" (regardless of label shown)',
      'Fill [data-testid="chaos-input-email"] with "john@test.com"',
      'Submit valid form — assert success (values correctly mapped)',
    ],
  },
  {
    id: 'CS-003', priority: 'P0', tag: 'chaos', icon: '♾️', category: 'Infinite Spinner',
    title: 'Infinite Spinner — Assert stuck loading state',
    steps: [
      'Toggle ON [data-testid="chaos-spinner"]',
      'Fill all fields with valid data',
      'Click [data-testid="chaos-submit-btn"]',
      'Assert [aria-busy="true"] on submit button persists > 5s',
      'Assert [data-testid="chaos-form-success"] is NOT present',
    ],
  },
  {
    id: 'CS-004', priority: 'P1', tag: 'chaos', icon: '🎲', category: 'Random Validation',
    title: 'Random Validation — Assert server error on a valid field',
    steps: [
      'Toggle ON [data-testid="chaos-random-validation"]',
      'Fill ALL fields with valid data',
      'Click submit',
      'Assert one chaos-error-{fieldId} element is visible',
      'Assert error text contains "Server validation failed"',
      'Assert [data-testid="chaos-form-success"] is NOT visible',
    ],
  },
  {
    id: 'CS-005', priority: 'P1', tag: 'chaos', icon: '🔠', category: 'Field Shuffle',
    title: 'Field Shuffle — Target by data-testid not DOM position',
    steps: [
      'Toggle ON [data-testid="chaos-field-shuffle"]',
      'Fill all fields using their data-testid selectors (never :nth-child)',
      'Click submit — fields re-order',
      'Assert data-testid attributes are stable after shuffle',
      'Submit valid data — assert success banner visible',
    ],
  },
  {
    id: 'CS-006', priority: 'P1', tag: 'chaos', icon: '👻', category: 'Ghost Field',
    title: 'Ghost Field — Detect & fill dynamic hidden field',
    steps: [
      'Toggle ON [data-testid="chaos-ghost-field"]',
      'Assert [data-testid="chaos-ghost-field-input"] becomes visible',
      'Submit without filling ghost field — assert validation error shown',
      'Fill [data-testid="chaos-ghost-field-input"] with value "42"',
      'Submit — assert [data-testid="chaos-form-success"] appears',
    ],
  },
  {
    id: 'CS-007', priority: 'P2', tag: 'chaos', icon: '🔥', category: 'All Chaos',
    title: 'All Chaos ON — Assert stability via data-testid only',
    steps: [
      'Enable all 5 chaos toggles',
      'Fill all fields + ghost field using ONLY data-testid selectors',
      'Submit — if random validation error fires, retry (max 3 times)',
      'Assert no test failure caused by visual/positional changes',
      'Assert all data-testid attrs remain stable throughout chaos',
    ],
  },
];

// ─── Chaos Scenarios Modal ──────────────────────────────────────────────────────
const ChaosScenarioModal = ({ onClose }) => {
  const [openId, setOpenId] = useState(null);
  const [copied, setCopied] = useState(false);

  const MASTER_PROMPT = `You are an expert QA automation engineer. Generate a complete Playwright (TypeScript) test script for the QA Playground Chaos Form Builder.

PAGE URL: /dashboard (requires login first with admin / Qwerty@1234)

CHAOS FORM SELECTORS (data-testid):
  chaos-form              → root form element
  chaos-toggle-bar        → container for all 5 toggles
  chaos-label-swap        → Label Swap toggle checkbox
  chaos-spinner           → Infinite Spinner toggle checkbox
  chaos-random-validation → Random Validation toggle checkbox
  chaos-field-shuffle     → Field Shuffle toggle checkbox
  chaos-ghost-field       → Ghost Field toggle checkbox
  chaos-input-name        → Full Name input
  chaos-input-email       → Email input
  chaos-input-phone       → Phone input
  chaos-select-dept       → Department select
  chaos-radio-priority    → Priority radio group wrapper
  chaos-textarea-msg      → Message textarea
  chaos-checkbox-terms    → Terms checkbox
  chaos-ghost-field-input → Ghost field verification code input (dynamic)
  chaos-submit-btn        → Submit button
  chaos-form-success      → Success banner
  chaos-form-error        → Error banner
  chaos-submit-log        → Submission log container
  chaos-error-{fieldId}  → Inline field error (e.g. chaos-error-name)

SCENARIOS TO COVER:
1. Happy Path (no chaos) → assert success banner
2. Label Swap → fill by data-testid, not label text → assert success
3. Infinite Spinner → assert aria-busy=true persists > 5s
4. Random Validation → assert server error on valid field
5. Field Shuffle → fill by data-testid → assert success
6. Ghost Field → detect dynamic input, fill with "42" → assert success
7. All chaos ON → retry logic for random validation (max 3x)

OUTPUT: TypeScript + Playwright, Page Object Model, beforeEach to login first.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MASTER_PROMPT);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (_) {}
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const priorityColors = { P0: '#ef4444', P1: '#f59e0b', P2: '#818cf8' };
  const tagColors = { baseline: '#10b981', chaos: '#f59e0b' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }} role="dialog" aria-modal="true">
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
      <div style={{
        position: 'relative', width: '100%', maxWidth: 660, maxHeight: '88vh',
        background: 'linear-gradient(145deg, #0f172a, #0c1222)',
        border: '1px solid #1e293b', borderRadius: 18,
        boxShadow: '0 0 60px rgba(239,68,68,0.12), 0 25px 50px rgba(0,0,0,0.6)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }} data-testid="chaos-scenarios-modal">
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>🔥</div>
            <div>
              <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: 0 }}>Chaos Test Scenarios</h2>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0' }}>Chaos Form Builder · QA Playground — {CHAOS_SCENARIOS.length} scenarios</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {['P0','P1','P2'].map(p => (
              <div key={p} style={{ background: `${priorityColors[p]}15`, border: `1px solid ${priorityColors[p]}40`, borderRadius: 6, padding: '2px 8px', textAlign: 'center' }}>
                <div style={{ color: priorityColors[p], fontWeight: 700, fontSize: 13 }}>{CHAOS_SCENARIOS.filter(s => s.priority === p).length}</div>
                <div style={{ color: priorityColors[p], fontSize: 8, fontWeight: 600 }}>{p}</div>
              </div>
            ))}
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4, marginLeft: 4 }} data-testid="chaos-scenarios-close" aria-label="Close">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Master Prompt CTA */}
        <div style={{ margin: '12px 20px 0', background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.07))', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexShrink: 0 }}>
          <div>
            <div style={{ color: '#fca5a5', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>🚀 AI Master Prompt</div>
            <p style={{ color: '#64748b', fontSize: 10.5, margin: 0 }}>Copy into ChatGPT / Claude / Gemini → get a full Playwright test file covering all 7 chaos scenarios.</p>
          </div>
          <button onClick={handleCopy} data-testid="chaos-copy-prompt" style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 8, border: 'none', background: copied ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #ef4444, #f97316)', color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {copied ? '✓ Copied!' : '⎘ Copy Prompt'}
          </button>
        </div>

        {/* Scenario List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px 16px' }}>
          {CHAOS_SCENARIOS.map(s => (
            <div key={s.id} style={{ background: openId === s.id ? 'rgba(239,68,68,0.06)' : 'rgba(15,23,42,0.4)', border: `1px solid ${openId === s.id ? '#ef444480' : '#1e293b'}`, borderRadius: 10, marginBottom: 6, overflow: 'hidden', transition: 'all 0.2s' }}>
              <button onClick={() => setOpenId(openId === s.id ? null : s.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                <span style={{ fontSize: 14 }}>{s.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 2 }}>
                    <span style={{ fontSize: 9, color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>{s.id}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 5px', borderRadius: 4, background: `${priorityColors[s.priority]}20`, color: priorityColors[s.priority], border: `1px solid ${priorityColors[s.priority]}` }}>{s.priority}</span>
                    <span style={{ fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 20, background: `${tagColors[s.tag]}18`, color: tagColors[s.tag] }}>#{s.tag}</span>
                  </div>
                  <span style={{ color: '#e2e8f0', fontSize: 11.5, fontWeight: 600 }}>{s.title}</span>
                </div>
                <svg style={{ width: 14, height: 14, color: '#64748b', transform: openId === s.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              {openId === s.id && (
                <div style={{ padding: '0 12px 10px 34px' }}>
                  <div style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase', color: '#ef4444', marginBottom: 4 }}>{s.category}</div>
                  <ol style={{ margin: 0, paddingLeft: 16 }}>
                    {s.steps.map((step, i) => <li key={i} style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6 }}>{step}</li>)}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ borderTop: '1px solid #1e293b', padding: '8px 20px', flexShrink: 0, display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ color: '#334155', fontSize: 10, margin: 0 }}>🔒 QA reference only · data-testid selectors are stable across all chaos modes</p>
          <span style={{ color: '#334155', fontSize: 10 }}>Powered by Playwright + AI 🤖</span>
        </div>
      </div>
    </div>
  );
};

// ─── Chaos Toggle Bar ──────────────────────────────────────────────────────────
const CHAOS_TOGGLES = [
  { key: 'labelSwap',        testid: 'chaos-label-swap',        label: 'Label Swap',      color: '#f59e0b', icon: '🔀' },
  { key: 'spinner',          testid: 'chaos-spinner',           label: 'Infinite Spinner', color: '#ef4444', icon: '♾️' },
  { key: 'randomValidation', testid: 'chaos-random-validation', label: 'Random Validation',color: '#8b5cf6', icon: '🎲' },
  { key: 'fieldShuffle',     testid: 'chaos-field-shuffle',     label: 'Field Shuffle',   color: '#06b6d4', icon: '🔠' },
  { key: 'ghostField',       testid: 'chaos-ghost-field',       label: 'Ghost Field',     color: '#64748b', icon: '👻' },
];

const ChaosToggleBar = ({ chaos, onToggle }) => {
  const anyActive = Object.values(chaos).some(Boolean);
  return (
    <div className="mb-6 p-4 rounded-xl border" style={{ background: anyActive ? 'rgba(239,68,68,0.04)' : 'rgba(0,0,0,0.02)', borderColor: anyActive ? 'rgba(239,68,68,0.3)' : '#e5e7eb' }} data-testid="chaos-toggle-bar">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">⚡</span>
          <span className="text-sm font-bold text-gray-700 dark:text-slate-200 uppercase tracking-wide">Chaos Controls</span>
        </div>
        {anyActive && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full animate-pulse" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>
            ⚡ CHAOS ACTIVE
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        {CHAOS_TOGGLES.map(t => (
          <label key={t.key} className="flex items-center gap-2 cursor-pointer group" title={`Toggle ${t.label} chaos mode`}>
            <div className="relative flex-shrink-0">
              <input type="checkbox" className="sr-only" checked={chaos[t.key]} onChange={() => onToggle(t.key)} data-testid={t.testid} />
              <div className="w-9 h-5 rounded-full transition-colors" style={{ background: chaos[t.key] ? t.color : '#d1d5db' }}/>
              <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-sm" style={{ transform: chaos[t.key] ? 'translateX(16px)' : 'translateX(0)' }} />
            </div>
            <span className="text-xs font-semibold transition-colors" style={{ color: chaos[t.key] ? t.color : '#6b7280' }}>
              {t.icon} {t.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ─── Submission Log ────────────────────────────────────────────────────────────
const SubmissionLog = ({ logs }) => {
  if (logs.length === 0) return null;
  const statusStyle = {
    success:    { bg: '#f0fdf4', border: '#86efac', text: '#16a34a', badge: '✅ SUCCESS' },
    'chaos-fail': { bg: '#fff7ed', border: '#fcd34d', text: '#d97706', badge: '🎲 CHAOS BLOCKED' },
    stuck:      { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '♾️ SPINNER STUCK' },
    failed:     { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '❌ FAILED' },
  };
  return (
    <div className="mt-6" data-testid="chaos-submit-log">
      <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">Submission Log</h3>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {logs.map((log, i) => {
          const s = statusStyle[log.status] || statusStyle.failed;
          return (
            <div key={i} className="rounded-lg p-2.5 flex items-start gap-3 text-xs font-mono" style={{ background: s.bg, border: `1px solid ${s.border}` }} data-testid={`chaos-log-entry-${i}`}>
              <span className="font-bold flex-shrink-0" style={{ color: s.text }}>{s.badge}</span>
              <span className="text-gray-500 flex-shrink-0">{log.time}</span>
              {log.detail && <span className="text-gray-600 truncate">{log.detail}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Error Message ─────────────────────────────────────────────────────────────
const FieldError = ({ fieldId, message }) => {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs text-red-500 flex items-center" data-testid={`chaos-error-${fieldId}`} role="alert">
      <svg className="w-3.5 h-3.5 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
      {message}
    </p>
  );
};

// ─── Main Chaos Form ───────────────────────────────────────────────────────────
const ChaosForm = () => {
  const { mockFetch } = useNetwork();
  const { addLog }    = useLogger();

  // Form values
  const [values, setValues] = useState({ name: '', email: '', phone: '', dept: '', priority: '', message: '', terms: false, ghost: '' });
  const [errors, setErrors] = useState({});

  // Chaos modes
  const [chaos, setChaos] = useState({ labelSwap: false, spinner: false, randomValidation: false, fieldShuffle: false, ghostField: false });

  // Submit state: idle | loading | success | error
  const [submitState, setSubmitState] = useState('idle');

  // Label swap — swaps every 4s when active
  const [labelSwapped, setLabelSwapped] = useState(false);

  // Field order — array of indices into BASE_FIELDS, shuffled on submit when chaos active
  const [fieldOrder, setFieldOrder] = useState(BASE_FIELDS.map((_, i) => i));

  // Submission log
  const [submitLog, setSubmitLog] = useState([]);

  // Scenarios modal
  const [showScenarios, setShowScenarios] = useState(false);

  // ── Label Swap interval ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!chaos.labelSwap) { setLabelSwapped(false); return; }
    const iv = setInterval(() => setLabelSwapped(prev => !prev), 4000);
    return () => clearInterval(iv);
  }, [chaos.labelSwap]);

  // ── Reset form state when spinne chaos is turned OFF ────────────────────────
  useEffect(() => {
    if (!chaos.spinner && submitState === 'loading') setSubmitState('idle');
  }, [chaos.spinner, submitState]);

  const toggleChaos = useCallback((key) => {
    setChaos(prev => {
      const next = { ...prev, [key]: !prev[key] };
      addLog('action', `Chaos Mode: "${key}" turned ${next[key] ? 'ON' : 'OFF'}`);
      return next;
    });
  }, [addLog]);

  const shuffleFieldOrder = useCallback(() => {
    setFieldOrder(prev => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
  }, []);

  const appendLog = useCallback((status, detail = '') => {
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    setSubmitLog(prev => [{ status, time, detail }, ...prev].slice(0, 10));
  }, []);

  // ── Submit handler ───────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (submitState === 'loading') return;

    // Field Shuffle chaos — re-order on every attempt
    if (chaos.fieldShuffle) shuffleFieldOrder();

    // Validate all fields
    const newErrors = {};
    Object.keys(VALIDATORS).forEach(k => {
      if (k === 'ghost') return;
      const err = VALIDATORS[k](values[k]);
      if (err) newErrors[k] = err;
    });
    // Ghost field validation
    if (chaos.ghostField) {
      const err = VALIDATORS.ghost(values.ghost);
      if (err) newErrors.ghost = err;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      appendLog('failed', `${Object.keys(newErrors).length} field(s) invalid`);
      addLog('error', `Chaos Form: Submit blocked — validation errors on [${Object.keys(newErrors).join(', ')}]`);
      return;
    }

    setErrors({});

    // Random Validation chaos — inject a fake server error on a valid field
    if (chaos.randomValidation) {
      const fields = ['name', 'email', 'phone', 'dept', 'priority', 'message'];
      const pick    = fields[Math.floor(Math.random() * fields.length)];
      setErrors({ [pick]: 'Server validation failed for this field. (chaos mode)' });
      appendLog('chaos-fail', `🎲 Random validation hit → [${pick}]`);
      addLog('error', `Chaos Form: Random validation chaos injected on field "${pick}"`);
      return;
    }

    // Infinite Spinner chaos — enter loading state and never resolve
    if (chaos.spinner) {
      setSubmitState('loading');
      appendLog('stuck', '♾️ Infinite spinner — form will not resolve');
      addLog('info', 'Chaos Form: Infinite spinner active — submission stuck');
      return;
    }

    // Normal submit — goes through mockFetch (obeys God Mode)
    setSubmitState('loading');
    addLog('request', 'Chaos Form: Submitting to /api/chaos-form');
    try {
      await mockFetch('/api/chaos-form', { values });
      setSubmitState('success');
      appendLog('success', `Chaos modes: [${Object.keys(chaos).filter(k => chaos[k]).join(', ') || 'none'}]`);
      addLog('info', 'Chaos Form: 200 OK — form submitted successfully');
      // Reset after 3s
      setTimeout(() => {
        setSubmitState('idle');
        setValues({ name: '', email: '', phone: '', dept: '', priority: '', message: '', terms: false, ghost: '' });
        setFieldOrder(BASE_FIELDS.map((_, i) => i));
      }, 3000);
    } catch (err) {
      setSubmitState('error');
      appendLog('failed', err.message);
      addLog('error', `Chaos Form: Submit failed — ${err.message}`);
      setTimeout(() => setSubmitState('idle'), 3000);
    }
  }, [submitState, chaos, values, shuffleFieldOrder, mockFetch, addLog, appendLog]);

  const handleChange = useCallback((field, value) => {
    setValues(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  }, [errors]);

  // ── Effective label for a field (swaps name/email when chaos active) ─────────
  const getLabel = (field) => {
    if (!chaos.labelSwap) return field.label;
    if (field.id === 'name')  return labelSwapped ? field.swapLabel  ?? field.label : field.label;
    if (field.id === 'email') return labelSwapped ? field.swapLabel  ?? field.label : field.label;
    return field.label;
  };

  const isLoading = submitState === 'loading';
  const isSuccess = submitState === 'success';
  const isError   = submitState === 'error';
  const anyActive = Object.values(chaos).some(Boolean);

  // ── Field renderers ──────────────────────────────────────────────────────────
  const renderField = (field) => {
    const label = getLabel(field);
    const inputClass = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 disabled:opacity-50 ${errors[field.id] ? 'border-red-400' : 'border-gray-300 dark:border-slate-600'}`;

    return (
      <div key={field.id}>
        {field.type !== 'checkbox' && (
          <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 mb-1" htmlFor={`chaos-${field.id}`}>
            {label}
            {field.required && <span className="text-red-500 ml-0.5">*</span>}
            {chaos.labelSwap && (field.id === 'name' || field.id === 'email') && (
              <span className="ml-2 text-xs font-mono px-1.5 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#d97706', border: '1px solid rgba(245,158,11,0.3)' }} title="Label may be swapped by chaos mode — always target by data-testid">
                🔀 swapped?
              </span>
            )}
          </label>
        )}

        {field.type === 'text' || field.type === 'email' || field.type === 'tel' ? (
          <input
            id={`chaos-${field.id}`}
            type={field.type}
            value={values[field.id]}
            onChange={e => handleChange(field.id, e.target.value)}
            disabled={isLoading}
            placeholder={field.type === 'email' ? 'you@example.com' : field.type === 'tel' ? '+1 234 567 8901' : 'Enter your full name'}
            className={inputClass}
            data-testid={`chaos-input-${field.id}`}
            aria-invalid={!!errors[field.id]}
          />
        ) : field.type === 'select' ? (
          <select
            id={`chaos-${field.id}`}
            value={values[field.id]}
            onChange={e => handleChange(field.id, e.target.value)}
            disabled={isLoading}
            className={inputClass}
            data-testid="chaos-select-dept"
            aria-invalid={!!errors[field.id]}
          >
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d || '— Select department —'}</option>)}
          </select>
        ) : field.type === 'radio' ? (
          <div className="flex flex-wrap gap-3" data-testid="chaos-radio-priority">
            {PRIORITIES.map(p => (
              <label key={p} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700 dark:text-slate-300">
                <input
                  type="radio"
                  name="chaos-priority"
                  value={p}
                  checked={values.priority === p}
                  onChange={() => handleChange('priority', p)}
                  disabled={isLoading}
                  className="text-indigo-600"
                  data-testid={`chaos-radio-${p.toLowerCase()}`}
                />
                {p}
              </label>
            ))}
          </div>
        ) : field.type === 'textarea' ? (
          <div className="relative">
            <textarea
              id={`chaos-${field.id}`}
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
            <span className="absolute bottom-2 right-3 text-xs text-gray-400 font-mono pointer-events-none">
              {values.message.length}/300
            </span>
          </div>
        ) : field.type === 'checkbox' ? (
          <label className="flex items-start gap-2 cursor-pointer" htmlFor="chaos-terms">
            <input
              id="chaos-terms"
              type="checkbox"
              checked={values.terms}
              onChange={e => handleChange('terms', e.target.checked)}
              disabled={isLoading}
              className="mt-0.5 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              data-testid="chaos-checkbox-terms"
              aria-invalid={!!errors.terms}
            />
            <span className="text-sm text-gray-600 dark:text-slate-300 select-none">{field.label}</span>
          </label>
        ) : null}

        <FieldError fieldId={field.id} message={errors[field.id]} />
      </div>
    );
  };

  // ── Ghost field ──────────────────────────────────────────────────────────────
  const renderGhostField = () => (
    <div className="rounded-xl p-4 border" style={{ background: 'rgba(100,116,139,0.06)', borderColor: 'rgba(100,116,139,0.3)', borderStyle: 'dashed' }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">👻</span>
        <label htmlFor="chaos-ghost" className="text-xs font-bold text-gray-500 dark:text-slate-400">
          Ghost Verification Code <span className="text-red-500">*</span>
        </label>
        <span className="text-xs px-1.5 py-0.5 rounded font-mono" style={{ background: 'rgba(100,116,139,0.15)', color: '#64748b' }}>dynamic field</span>
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
      <p className="text-xs text-gray-400 mt-1.5">🤖 Can your automation find and fill this dynamically injected field?</p>
    </div>
  );

  return (
    <>
      {/* ── Floating Chaos Scenarios Button ────────────────────────────────── */}
      <button
        onClick={() => setShowScenarios(true)}
        data-testid="chaos-scenarios-btn"
        className="fixed bottom-6 left-6 flex items-center gap-2 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg z-50 transition-all duration-200 hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: '0 4px 20px rgba(239,68,68,0.4)' }}
        aria-label="View Chaos Test Scenarios"
      >
        <span className="text-base">🔥</span>
        <span>Chaos Scenarios</span>
      </button>

      {/* ── Chaos Scenarios Modal ───────────────────────────────────────────── */}
      {showScenarios && <ChaosScenarioModal onClose={() => setShowScenarios(false)} />}

      {/* ── Main Card ──────────────────────────────────────────────────────── */}
      <div
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border-2 transition-all duration-300 md:col-span-2 lg:col-span-3"
        style={{ borderColor: anyActive ? 'rgba(239,68,68,0.4)' : '#e5e7eb' }}
        data-testid="chaos-form"
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-6 py-4 border-b dark:border-slate-700 rounded-t-xl"
          style={{ background: anyActive ? 'linear-gradient(135deg, rgba(239,68,68,0.05), rgba(249,115,22,0.03))' : 'transparent', borderColor: anyActive ? 'rgba(239,68,68,0.2)' : undefined }}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: anyActive ? 'linear-gradient(135deg, #ef4444, #f97316)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: anyActive ? '0 3px 12px rgba(239,68,68,0.35)' : '0 3px 12px rgba(99,102,241,0.3)' }}>
              {anyActive ? '⚡' : '📋'}
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Chaos Form Builder</h2>
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
            <div className="mb-5 p-4 rounded-xl text-sm text-center font-semibold" style={{ background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a' }} data-testid="chaos-form-success" role="alert">
              🎉 Form submitted successfully! All data validated and accepted.
            </div>
          )}

          {/* Network Error Banner */}
          {isError && (
            <div className="mb-5 p-3 rounded-xl text-sm text-center" style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }} data-testid="chaos-form-error" role="alert">
              Network error — check God Mode panel (Force Offline / 500 Error active?)
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Render fields in current order (possibly shuffled) */}
            {fieldOrder.map(idx => {
              const field = BASE_FIELDS[idx];
              // Insert Ghost Field before message (idx 5) when chaos active
              if (field.id === 'message' && chaos.ghostField) {
                return (
                  <React.Fragment key={`ghost-${field.id}`}>
                    {renderGhostField()}
                    {renderField(field)}
                  </React.Fragment>
                );
              }
              return <React.Fragment key={field.id}>{renderField(field)}</React.Fragment>;
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
                  ? (chaos.spinner ? 'linear-gradient(135deg, #ef4444, #f97316)' : '#818cf8')
                  : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: isLoading ? 'none' : '0 4px 14px rgba(99,102,241,0.35)',
              }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>
                  <span>{chaos.spinner ? '♾️ Submitting… (infinite spinner chaos)' : 'Submitting…'}</span>
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
  );
};

export default ChaosForm;

import React, { useState, useRef, useEffect, useCallback } from 'react';

// ─── Master Automation Prompt ──────────────────────────────────────────────────
const MASTER_PROMPT = `You are an expert QA automation engineer. Generate a complete Playwright (TypeScript) test script for the QA Playground Login Page based on the following specification:

PAGE URL: /login
TEST CREDENTIALS: admin / Qwerty@1234
SELECTORS (data-testid):
  - login-username       → Username input field
  - login-password       → Password input field
  - password-toggle      → Show/hide password button
  - login-remember-me    → Remember Me checkbox
  - login-submit         → Sign In button
  - login-error          → Global auth error banner
  - username-error-msg   → Username inline error
  - password-error-msg   → Password inline error
  - lockout-banner       → Lockout/rate-limit banner
  - lockout-timer        → Countdown timer inside lockout banner
  - test-credentials     → Dev credentials hint block
  - ac-open-btn          → Acceptance Criteria floating button

SCENARIOS TO COVER:
1. Happy Path: valid credentials → assert redirect to /dashboard
2. Empty Username: submit with no username → assert username-error-msg visible
3. Empty Password: submit with no password → assert password-error-msg visible
4. Numbers-only Username: assert validation error shown
5. Symbols-only Username: assert validation error shown
6. Short Password (<8 chars): assert inline error
7. Password missing uppercase: assert inline error
8. Password missing number: assert inline error
9. Password missing special char: assert inline error
10. Invalid Credentials: assert login-error banner visible with correct message
11. Sign In button disabled when fields empty: assert button disabled state
12. Password masking: assert input type=password by default
13. Show/hide password toggle: click toggle → assert type changes to text → click again → back to password
14. Rate Limiting (5 failures): submit invalid creds 5 times → assert lockout-banner visible → wait 31s → assert lockout-banner gone
15. Remember Me checked → reload → assert user still logged in (localStorage has token)
16. Remember Me unchecked → close tab simulation → assert sessionStorage cleared
17. XSS injection in username field: input <script>alert(1)</script> → assert error not executed
18. Max-length enforcement: type >14 chars in username → assert input capped at 14
19. Keyboard accessibility: Tab through all fields → Enter to submit
20. Responsive layout: assert page renders correctly at 375px (mobile) and 1440px (desktop)

OUTPUT FORMAT:
- TypeScript + Playwright test file
- Use Page Object Model pattern
- Each scenario in its own test block with descriptive name
- Add beforeEach hook to navigate to /login and clear localStorage
- Add comments explaining the rationale for each assertion
- Include a README section at the top as a comment block

Generate the complete, runnable test file now.`;

// ─── Scenarios Data ────────────────────────────────────────────────────────────
const TEST_SCENARIOS = [
  {
    id: 'TC-L-001',
    category: 'Happy Path',
    categoryColor: '#10b981',
    icon: '✅',
    title: 'Valid Login → Dashboard Redirect',
    priority: 'P0',
    steps: [
      'Navigate to /login',
      'Enter valid username: admin',
      'Enter valid password: Qwerty@1234',
      'Click Sign In',
      'Assert URL redirects to /dashboard',
    ],
    selector: 'login-submit',
    tag: 'smoke',
  },
  {
    id: 'TC-L-002',
    category: 'Field Validation',
    categoryColor: '#f59e0b',
    icon: '🔤',
    title: 'Empty Username → Inline Error',
    priority: 'P1',
    steps: [
      'Navigate to /login',
      'Leave username blank, click Sign In',
      'Assert [data-testid="username-error-msg"] is visible',
      'Assert text: "Username is required."',
    ],
    selector: 'username-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-003',
    category: 'Field Validation',
    categoryColor: '#f59e0b',
    icon: '🔑',
    title: 'Empty Password → Inline Error',
    priority: 'P1',
    steps: [
      'Fill username with valid value',
      'Leave password empty, click Sign In',
      'Assert [data-testid="password-error-msg"] visible',
      'Assert text: "Password can\'t be empty."',
    ],
    selector: 'password-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-004',
    category: 'Field Validation',
    categoryColor: '#f59e0b',
    icon: '🔢',
    title: 'Numbers-Only Username Rejected',
    priority: 'P2',
    steps: [
      'Type "123456" in username field',
      'Blur the field (click away)',
      'Assert inline error: "cannot be numbers only"',
    ],
    selector: 'username-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-005',
    category: 'Field Validation',
    categoryColor: '#f59e0b',
    icon: '🚫',
    title: 'Symbols-Only Username Rejected',
    priority: 'P2',
    steps: [
      'Type "!@#$%" in username field',
      'Blur the field',
      'Assert inline error: "cannot contain only special symbols"',
    ],
    selector: 'username-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-006',
    category: 'Password Rules',
    categoryColor: '#8b5cf6',
    icon: '🔐',
    title: 'Password: Min-Length Not Met',
    priority: 'P1',
    steps: [
      'Enter password "Ab@1" (< 8 chars)',
      'Blur password field',
      'Assert error: "at least 8 characters"',
    ],
    selector: 'password-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-007',
    category: 'Password Rules',
    categoryColor: '#8b5cf6',
    icon: '🔐',
    title: 'Password: Missing Uppercase',
    priority: 'P2',
    steps: [
      'Enter "abcdef1@" (no uppercase)',
      'Blur field',
      'Assert error: "at least 1 uppercase letter"',
    ],
    selector: 'password-error-msg',
    tag: 'validation',
  },
  {
    id: 'TC-L-008',
    category: 'Security',
    categoryColor: '#ef4444',
    icon: '🛡️',
    title: 'Rate Limit: 5 Failed Attempts → Lockout',
    priority: 'P0',
    steps: [
      'Submit invalid credentials 5 times',
      'Assert [data-testid="lockout-banner"] appears',
      'Assert lockout-timer starts countdown from 30',
      'Wait 31s → assert lockout-banner gone, form re-enabled',
    ],
    selector: 'lockout-banner',
    tag: 'security',
  },
  {
    id: 'TC-L-009',
    category: 'Security',
    categoryColor: '#ef4444',
    icon: '💉',
    title: 'XSS Injection Rejected',
    priority: 'P0',
    steps: [
      'Type <script>alert(1)</script> in username',
      'Assert field shows validation error',
      'Assert no alert/script is executed',
      'Assert DOM does not contain injected script tag',
    ],
    selector: 'username-error-msg',
    tag: 'security',
  },
  {
    id: 'TC-L-010',
    category: 'Security',
    categoryColor: '#ef4444',
    icon: '👁️',
    title: 'Password Always Masked by Default',
    priority: 'P1',
    steps: [
      'Assert password input type="password"',
      'Click password-toggle',
      'Assert type changes to "text"',
      'Click toggle again → assert type back to "password"',
    ],
    selector: 'password-toggle',
    tag: 'security',
  },
  {
    id: 'TC-L-011',
    category: 'UX & State',
    categoryColor: '#06b6d4',
    icon: '🔘',
    title: 'Sign In Button Disabled Until Fields Filled',
    priority: 'P1',
    steps: [
      'On fresh page load, assert submit button is disabled',
      'Fill valid username only → assert still disabled',
      'Fill valid password → assert button becomes enabled',
    ],
    selector: 'login-submit',
    tag: 'ux',
  },
  {
    id: 'TC-L-012',
    category: 'UX & State',
    categoryColor: '#06b6d4',
    icon: '💾',
    title: 'Remember Me → Persists in localStorage',
    priority: 'P1',
    steps: [
      'Check "Remember Me" checkbox',
      'Login with valid credentials',
      'Reload the page',
      'Assert user is still authenticated (no redirect to /login)',
      'Assert localStorage contains auth token',
    ],
    selector: 'login-remember-me',
    tag: 'session',
  },
  {
    id: 'TC-L-013',
    category: 'UX & State',
    categoryColor: '#06b6d4',
    icon: '⌨️',
    title: 'Keyboard-Only Navigation (Accessibility)',
    priority: 'P2',
    steps: [
      'Focus username field, Tab → focus moves to password',
      'Tab → focus moves to show/hide button',
      'Tab → Remember Me checkbox',
      'Tab → Sign In button (Enter submits)',
      'Assert no mouse interaction required',
    ],
    selector: 'login-username',
    tag: 'a11y',
  },
  {
    id: 'TC-L-014',
    category: 'UX & State',
    categoryColor: '#06b6d4',
    icon: '📏',
    title: 'Max Length Enforced on Username (14 chars)',
    priority: 'P2',
    steps: [
      'Attempt to type 20 characters in username field',
      'Assert input value is capped at 14 characters',
      'Assert character counter shows "14/14" in red',
    ],
    selector: 'login-username',
    tag: 'validation',
  },
  {
    id: 'TC-L-015',
    category: 'Responsive',
    categoryColor: '#ec4899',
    icon: '📱',
    title: 'Mobile Layout — 375px Viewport',
    priority: 'P2',
    steps: [
      'Set viewport to 375×812',
      'Assert login card is fully visible without horizontal scroll',
      'Assert all form fields are full width',
      'Assert Acceptance Criteria button is reachable',
    ],
    selector: 'login-username',
    tag: 'responsive',
  },
];

// ─── Priority Badge ────────────────────────────────────────────────────────────
const PriorityBadge = ({ level }) => {
  const colors = {
    P0: { bg: '#ef444420', border: '#ef4444', text: '#ef4444' },
    P1: { bg: '#f59e0b20', border: '#f59e0b', text: '#f59e0b' },
    P2: { bg: '#6366f120', border: '#6366f1', text: '#818cf8' },
  };
  const c = colors[level] || colors.P2;
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
      padding: '1px 6px', borderRadius: 4,
      background: c.bg, border: `1px solid ${c.border}`, color: c.text,
    }}>
      {level}
    </span>
  );
};

// ─── Tag Badge ─────────────────────────────────────────────────────────────────
const TagBadge = ({ tag }) => {
  const colors = {
    smoke:      '#10b981', validation: '#f59e0b', security: '#ef4444',
    ux:         '#06b6d4', session:    '#8b5cf6', a11y:     '#84cc16',
    responsive: '#ec4899',
  };
  return (
    <span style={{
      fontSize: 9, fontWeight: 600, letterSpacing: 0.4,
      padding: '1px 6px', borderRadius: 20,
      background: `${colors[tag] ?? '#6366f1'}18`,
      color: colors[tag] ?? '#818cf8',
      border: `1px solid ${colors[tag] ?? '#6366f1'}30`,
    }}>
      #{tag}
    </span>
  );
};

// ─── Scenario Card ─────────────────────────────────────────────────────────────
const ScenarioCard = ({ scenario, isOpen, onToggle }) => (
  <div
    style={{
      background: isOpen ? 'rgba(99,102,241,0.06)' : 'rgba(15,23,42,0.4)',
      border: `1px solid ${isOpen ? '#4f46e5' : '#1e293b'}`,
      borderRadius: 10,
      marginBottom: 6,
      overflow: 'hidden',
      transition: 'all 0.2s ease',
    }}
  >
    {/* Header */}
    <button
      onClick={() => onToggle(scenario.id)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center',
        gap: 8, padding: '8px 12px', background: 'transparent',
        border: 'none', cursor: 'pointer', textAlign: 'left',
      }}
      aria-expanded={isOpen}
    >
      <span style={{ fontSize: 14 }}>{scenario.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 2 }}>
          <span style={{ color: '#94a3b8', fontSize: 9, fontFamily: 'monospace', fontWeight: 600 }}>
            {scenario.id}
          </span>
          <PriorityBadge level={scenario.priority} />
          <TagBadge tag={scenario.tag} />
        </div>
        <span style={{ color: '#e2e8f0', fontSize: 11.5, fontWeight: 600, lineHeight: 1.3, display: 'block' }}>
          {scenario.title}
        </span>
      </div>
      <svg
        style={{
          width: 14, height: 14, color: '#64748b', flexShrink: 0,
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s ease',
        }}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    {/* Steps */}
    {isOpen && (
      <div style={{ padding: '0 12px 10px 34px' }}>
        <div style={{
          fontSize: 9.5, fontWeight: 600, letterSpacing: 0.8, textTransform: 'uppercase',
          color: scenario.categoryColor, marginBottom: 4,
        }}>
          {scenario.category}
        </div>
        <ol style={{ margin: 0, paddingLeft: 16 }}>
          {scenario.steps.map((step, i) => (
            <li key={i} style={{ color: '#94a3b8', fontSize: 11, lineHeight: 1.6, paddingLeft: 2 }}>
              {step}
            </li>
          ))}
        </ol>
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <svg style={{ width: 10, height: 10, color: '#475569' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
          </svg>
          <code style={{ fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>
            [data-testid="{scenario.selector}"]
          </code>
        </div>
      </div>
    )}
  </div>
);

// ─── Category Filter ───────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Happy Path', 'Field Validation', 'Password Rules', 'Security', 'UX & State', 'Responsive'];

// ─── Main Modal ────────────────────────────────────────────────────────────────
const TestScenariosModal = ({ onClose }) => {
  const [openId, setOpenId]         = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [copied, setCopied]         = useState(false);
  const [copyTarget, setCopyTarget] = useState('prompt'); // 'prompt' | 'ids'
  const modalRef = useRef(null);

  const handleToggle = useCallback((id) => {
    setOpenId(prev => (prev === id ? null : id));
  }, []);

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(MASTER_PROMPT);
      setCopyTarget('prompt');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      console.warn('Clipboard write failed');
    }
  };

  const filtered = activeCategory === 'All'
    ? TEST_SCENARIOS
    : TEST_SCENARIOS.filter(s => s.category === activeCategory);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const stats = {
    total: TEST_SCENARIOS.length,
    p0:    TEST_SCENARIOS.filter(s => s.priority === 'P0').length,
    p1:    TEST_SCENARIOS.filter(s => s.priority === 'P1').length,
    p2:    TEST_SCENARIOS.filter(s => s.priority === 'P2').length,
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
      }}
      role="dialog" aria-modal="true" aria-label="Test Scenarios to Automate"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          background: 'linear-gradient(145deg, #0f172a 0%, #0c1222 100%)',
          border: '1px solid #1e293b',
          borderRadius: 18,
          boxShadow: '0 0 60px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.6)',
          width: '100%', maxWidth: 680,
          maxHeight: '90vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
        data-testid="test-scenarios-modal"
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #1e293b',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: 18 }}>🤖</span>
            </div>
            <div>
              <h2 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 16, margin: 0 }}>
                Tests to Automate
              </h2>
              <p style={{ color: '#64748b', fontSize: 11, margin: '2px 0 0' }}>
                Login Page · QA Playground — {stats.total} scenarios
              </p>
            </div>
          </div>

          {/* Stats pills */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {[
              { label: 'P0', count: stats.p0, color: '#ef4444' },
              { label: 'P1', count: stats.p1, color: '#f59e0b' },
              { label: 'P2', count: stats.p2, color: '#818cf8' },
            ].map(s => (
              <div key={s.label} style={{
                background: `${s.color}15`, border: `1px solid ${s.color}40`,
                borderRadius: 6, padding: '2px 8px', textAlign: 'center',
              }}>
                <div style={{ color: s.color, fontWeight: 700, fontSize: 13 }}>{s.count}</div>
                <div style={{ color: s.color, fontSize: 8, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
            <button
              onClick={onClose}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: '#475569', padding: 4, marginLeft: 4,
              }}
              aria-label="Close"
              data-testid="ts-modal-close"
            >
              <svg style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Master Prompt CTA */}
        <div style={{
          margin: '12px 20px 0',
          background: 'linear-gradient(135deg, rgba(79,70,229,0.12), rgba(124,58,237,0.08))',
          border: '1px solid rgba(99,102,241,0.3)',
          borderRadius: 12, padding: '10px 14px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: '#a5b4fc', fontWeight: 700, fontSize: 12, marginBottom: 2 }}>
              🚀 AI Master Prompt
            </div>
            <p style={{ color: '#64748b', fontSize: 10.5, margin: 0, lineHeight: 1.4 }}>
              Copy this prompt into ChatGPT / Claude / Gemini to generate a full Playwright test script for all 15 scenarios above.
            </p>
          </div>
          <button
            onClick={handleCopyPrompt}
            data-testid="copy-master-prompt"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer',
              background: copied && copyTarget === 'prompt'
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: 11,
              boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            {copied && copyTarget === 'prompt' ? (
              <>
                <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg style={{ width: 13, height: 13 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy Prompt
              </>
            )}
          </button>
        </div>

        {/* Category Filter */}
        <div style={{
          padding: '10px 20px 0',
          display: 'flex', gap: 5, flexWrap: 'wrap',
          flexShrink: 0,
        }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '3px 10px', borderRadius: 20, fontSize: 10.5, fontWeight: 600,
                border: `1px solid ${activeCategory === cat ? '#4f46e5' : '#1e293b'}`,
                background: activeCategory === cat ? 'rgba(79,70,229,0.2)' : 'transparent',
                color: activeCategory === cat ? '#a5b4fc' : '#475569',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Scenarios List */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '10px 20px 16px' }}>
          {filtered.length === 0 ? (
            <p style={{ color: '#475569', fontSize: 12, textAlign: 'center', marginTop: 20 }}>
              No scenarios in this category.
            </p>
          ) : (
            filtered.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isOpen={openId === scenario.id}
                onToggle={handleToggle}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <div style={{
          borderTop: '1px solid #1e293b', padding: '8px 20px',
          flexShrink: 0, background: 'rgba(15,23,42,0.6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <p style={{ color: '#334155', fontSize: 10, margin: 0 }}>
            🔒 For QA reference only · Not visible in production
          </p>
          <span style={{ color: '#334155', fontSize: 10 }}>
            Powered by Playwright + AI 🤖
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── Floating Trigger Button ───────────────────────────────────────────────────
const TestScenariosPanel = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        style={{
          position: 'fixed', bottom: 72, right: 24,
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
          color: '#fff', border: 'none', borderRadius: 50,
          padding: '10px 18px',
          boxShadow: '0 4px 20px rgba(124,58,237,0.45), 0 0 0 1px rgba(124,58,237,0.2)',
          cursor: 'pointer', fontWeight: 700, fontSize: 13,
          transition: 'all 0.2s ease',
          zIndex: 50,
        }}
        aria-label="View Test Scenarios to Automate"
        data-testid="ts-open-btn"
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        <span style={{ fontSize: 16 }}>🤖</span>
        <span>Tests to Automate</span>
      </button>

      {showModal && <TestScenariosModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default TestScenariosPanel;

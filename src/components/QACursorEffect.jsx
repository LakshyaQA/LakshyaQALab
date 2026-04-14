import React, { useEffect, useRef, useState, useCallback } from 'react'

// ─── QA Humor & Facts Pool ─────────────────────────────────────────────────────
const QA_WISDOM = [
  { type: 'humor', icon: '🐛', text: 'Oops... is that a bug or a feature?' },
  { type: 'fact', icon: '🔬', text: 'Fact: 70% of bugs are found in only 20% of the code.' },
  { type: 'humor', icon: '😅', text: 'It works on my machine™' },
  { type: 'fact', icon: '📊', text: 'Fact: A bug found in prod costs 100× more to fix.' },
  { type: 'humor', icon: '🤔', text: 'Wait — is this an edge case or expected behavior?' },
  { type: 'humor', icon: '🧪', text: 'sudo fix_all_bugs — wish this existed.' },
  { type: 'fact', icon: '🏆', text: 'Fact: QA engineers prevent more bugs than they find.' },
  { type: 'humor', icon: '🕵️', text: "Looking for bugs… they're shy creatures." },
  {
    type: 'humor',
    icon: '☕',
    text: 'QA Engineer: "Can I manually test coffee? Asking for a friend."',
  },
  { type: 'fact', icon: '⚡', text: 'Fact: Shift-left testing reduces rework by up to 50%.' },
  { type: 'humor', icon: '🎯', text: 'Undefined. Not a bug. A philosophical state.' },
  { type: 'humor', icon: '👀', text: 'Psst… edge case hiding right here.' },
  { type: 'fact', icon: '🔒', text: 'Fact: SQL injection still ranks in OWASP Top 10.' },
  { type: 'humor', icon: '🐞', text: "I found your bug. It's between the keyboard and the chair." },
  { type: 'humor', icon: '🤖', text: 'Automating tests so I can manually find more bugs.' },
  { type: 'fact', icon: '🌐', text: 'Fact: Boundary value testing catches ~88% of input errors.' },
  { type: 'humor', icon: '😈', text: 'What happens when you skip QA? Production does.' },
  { type: 'humor', icon: '🕯️', text: "Testing in the dark? I've got a spotlight for that." },
  { type: 'fact', icon: '📱', text: 'Fact: Mobile testing requires 100+ device combinations.' },
  { type: 'humor', icon: '🔮', text: '"It\'s just a UI glitch." — Famous last words.' },
]

// ─── Matrix Characters ─────────────────────────────────────────────────────────
const MATRIX_CHARS =
  'PASS FAIL NULL 404 ✓ ✗ BUG FIX TEST QA AUTO CI CD API NULL ERROR 200 500 ASSERT MOCK STUB SPY'.split(
    ' '
  )

// ─── Canvas Matrix Rain Component ──────────────────────────────────────────────
// lightMode: true → canvas hidden (opacity 0), dark → full matrix rain
const MatrixCanvas = ({ mousePos, lightMode }) => {
  const canvasRef = useRef(null)
  const dropsRef = useRef([])
  const animRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const cols = Math.floor(canvas.width / 20)
      dropsRef.current = Array.from({ length: cols }, () => (Math.random() * -canvas.height) / 14)
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      // In light mode, skip drawing entirely (canvas stays hidden)
      if (!lightMode) {
        ctx.fillStyle = 'rgba(2, 6, 23, 0.06)'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const drops = dropsRef.current
        drops.forEach((y, i) => {
          const char = MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
          const x = i * 20

          const dx = x - (mousePos.current?.x ?? -9999)
          const dy = y * 14 - (mousePos.current?.y ?? -9999)
          const dist = Math.sqrt(dx * dx + dy * dy)
          const spotlight = Math.max(0, 1 - dist / 220)

          const alpha = 0.08 + spotlight * 0.7
          const green = Math.floor(80 + spotlight * 175)
          const blue = Math.floor(50 + spotlight * 100)

          ctx.fillStyle = `rgba(0, ${green}, ${blue}, ${alpha})`
          ctx.font = `${10 + spotlight * 4}px 'Courier New', monospace`
          ctx.fillText(char, x, y * 14)

          if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0
          drops[i] += 0.35
        })
      }

      animRef.current = requestAnimationFrame(draw)
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animRef.current)
    }
  }, [mousePos, lightMode])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: lightMode ? 0 : 1,
        transition: 'opacity 0.6s ease',
      }}
    />
  )
}

// ─── Floating Bug Particles ────────────────────────────────────────────────────
const BUG_EMOJIS = ['🐛', '🦟', '🪲', '🦗', '💀', '🔍', '⚡', '🧬']

const generateInitialBugs = () =>
  Array.from({ length: 14 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    emoji: BUG_EMOJIS[i % BUG_EMOJIS.length],
    speed: 0.2 + Math.random() * 0.4,
    phase: Math.random() * Math.PI * 2,
    size: 14 + Math.random() * 12,
  }))

const FloatingBugs = ({ mousePos, lightMode }) => {
  const [bugs, setBugs] = useState(generateInitialBugs)
  const bugsRef = useRef(bugs)
  const tickRef = useRef(0)

  useEffect(() => {
    bugsRef.current = bugs
  }, [bugs])

  useEffect(() => {
    let raf
    const animate = () => {
      tickRef.current += 0.012
      setBugs(prev =>
        prev.map(b => ({
          ...b,
          x: b.x + Math.sin(tickRef.current * b.speed + b.phase) * 0.06,
          y: b.y + Math.cos(tickRef.current * b.speed * 0.7 + b.phase) * 0.04,
        }))
      )
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf)
  }, [])

  // In light mode, bugs are clearly visible — vibrant with cursor reveal
  const baseOpacity = lightMode ? 0.22 : 0.05
  const revealFactor = lightMode ? 0.78 : 0.92
  const revealRadius = lightMode ? 140 : 160

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
      {bugs.map(bug => {
        const bx = (bug.x / 100) * window.innerWidth
        const by = (bug.y / 100) * window.innerHeight
        const mx = mousePos.current?.x ?? -9999
        const my = mousePos.current?.y ?? -9999
        const dist = Math.sqrt((bx - mx) ** 2 + (by - my) ** 2)
        const reveal = Math.max(0, 1 - dist / revealRadius)

        return (
          <div
            key={bug.id}
            style={{
              position: 'absolute',
              left: `${bug.x}%`,
              top: `${bug.y}%`,
              fontSize: `${bug.size}px`,
              opacity: baseOpacity + reveal * revealFactor,
              transform: `scale(${0.5 + reveal * 0.8}) rotate(${reveal * 15}deg)`,
              transition: 'opacity 0.15s ease, transform 0.15s ease',
              filter:
                reveal > 0.2
                  ? lightMode
                    ? `drop-shadow(0 0 10px rgba(99,102,241,0.7))`
                    : `drop-shadow(0 0 8px rgba(16,185,129,0.8))`
                  : lightMode
                    ? `drop-shadow(0 0 4px rgba(99,102,241,0.3))`
                    : 'none',
              userSelect: 'none',
            }}
          >
            {bug.emoji}
          </div>
        )
      })}
    </div>
  )
}

// ─── Wisdom Tooltip that follows cursor ────────────────────────────────────────
const WisdomTooltip = ({ item, pos }) => {
  if (!item) return null
  const typeColor = item.type === 'humor' ? '#f59e0b' : '#10b981'
  const typeLabel = item.type === 'humor' ? 'QA Humor' : 'QA Fact'

  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x + 20,
        top: pos.y - 10,
        zIndex: 9999,
        pointerEvents: 'none',
        maxWidth: 280,
        background: 'rgba(2, 8, 32, 0.92)',
        border: `1px solid ${typeColor}40`,
        borderRadius: 12,
        padding: '10px 14px',
        boxShadow: `0 0 20px ${typeColor}30, 0 4px 24px rgba(0,0,0,0.5)`,
        animation: 'qa-tooltip-in 0.2s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 18 }}>{item.icon}</span>
        <span
          style={{
            color: typeColor,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          {typeLabel}
        </span>
      </div>
      <p
        style={{
          color: '#e2e8f0',
          fontSize: 12,
          lineHeight: 1.5,
          margin: 0,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {item.text}
      </p>
    </div>
  )
}

// ─── Spotlight Overlay (torch effect) ─────────────────────────────────────────
const SpotlightOverlay = ({ mousePos, lightMode }) => {
  const [pos, setPos] = useState({ x: -500, y: -500 })

  useEffect(() => {
    let raf
    const lerp = (a, b, t) => a + (b - a) * t
    let lx = -500,
      ly = -500

    const tick = () => {
      const target = mousePos.current ?? { x: -500, y: -500 }
      lx = lerp(lx, target.x, 0.12)
      ly = lerp(ly, target.y, 0.12)
      setPos({ x: lx, y: ly })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [mousePos])

  // Light mode: softer, indigo-tinted spotlight
  const gradient = lightMode
    ? `radial-gradient(ellipse 200px 160px at ${pos.x}px ${pos.y}px,
        rgba(99,102,241,0.05) 0%,
        rgba(99,102,241,0.02) 40%,
        transparent 70%)`
    : `radial-gradient(ellipse 220px 180px at ${pos.x}px ${pos.y}px,
        rgba(16,185,129,0.04) 0%,
        rgba(99,102,241,0.03) 40%,
        transparent 70%)`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        background: gradient,
      }}
    />
  )
}

// ─── Main QA Cursor Effect ─────────────────────────────────────────────────────
// Props:
//   lightMode     {boolean} - if true, shows light-theme-friendly effects (no dark matrix)
//   disableTooltips {boolean} - if true, wisdom tooltips never appear (safe for automation)
const QACursorEffect = ({ lightMode = false, disableTooltips = false }) => {
  const mousePos = useRef({ x: -9999, y: -9999 })
  const [tooltip, setTooltip] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const lastWisdomTime = useRef(0)
  const wisdomTimeout = useRef(null)
  const lastIdx = useRef(-1)

  const pickWisdom = useCallback(() => {
    let idx
    do {
      idx = Math.floor(Math.random() * QA_WISDOM.length)
    } while (idx === lastIdx.current)
    lastIdx.current = idx
    return QA_WISDOM[idx]
  }, [])

  // Zone guard: returns true ONLY when cursor is safely in the background
  // — never over the login card (center) or floating buttons (bottom-right)
  const isInBackgroundZone = useCallback((x, y) => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    // Floating button zone — bottom-right 300×180px
    if (x > vw - 300 && y > vh - 180) return false
    // Login card zone — centered, roughly 480px wide, full height
    const cardLeft = (vw - 480) / 2
    const cardRight = (vw + 480) / 2
    if (x > cardLeft && x < cardRight && y > 30) return false
    return true
  }, [])

  const handleMouseMove = useCallback(
    e => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Hard-disabled — never show
      if (disableTooltips) return

      // Only show in safe background area, not over card or buttons
      if (!isInBackgroundZone(e.clientX, e.clientY)) return

      const now = Date.now()
      if (now - lastWisdomTime.current > 2200) {
        lastWisdomTime.current = now
        setTooltipPos({ x: e.clientX, y: e.clientY })
        setTooltip(pickWisdom())

        clearTimeout(wisdomTimeout.current)
        wisdomTimeout.current = setTimeout(() => setTooltip(null), 3200)
      }
    },
    [pickWisdom, disableTooltips, isInBackgroundZone]
  )

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      clearTimeout(wisdomTimeout.current)
    }
  }, [handleMouseMove])

  return (
    <>
      <style>{`
        @keyframes qa-tooltip-in {
          from { opacity: 0; transform: translateY(6px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Matrix rain canvas — hidden in light mode */}
      <MatrixCanvas mousePos={mousePos} lightMode={lightMode} />

      {/* Floating bug particles — very subtle in light mode */}
      <FloatingBugs mousePos={mousePos} lightMode={lightMode} />

      {/* Cursor spotlight */}
      <SpotlightOverlay mousePos={mousePos} lightMode={lightMode} />

      {/* QA Wisdom tooltip — shown in background zone only, darkness not required */}
      {!disableTooltips && <WisdomTooltip item={tooltip} pos={tooltipPos} />}
    </>
  )
}

export default QACursorEffect

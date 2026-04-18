import React, { useState, useEffect } from 'react'
import Sidebar from '../components/navigation/Sidebar'
import ControlCenter from '../components/sandbox/ControlCenter'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useLogger } from '../context/LoggerContext'
import { aiService } from '../services/aiService'
import APIKeyModal from '../components/qa/APIKeyModal'

const XPathLab = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { addLog } = useLogger()

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTool, setActiveTool] = useState('Selenium') // Selenium, AppiumAndroid, AppiumIOS, Playwright
  const [inputXpath, setInputXpath] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [highlightedElement, setHighlightedElement] = useState(null)
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('refactor') // refactor, html, vision
  const [htmlInput, setHtmlInput] = useState('')
  const [_aiConfigured, setAiConfigured] = useState(true) // Default community key is always active

  useEffect(() => {
    document.title = 'XPath & Locator Lab | LakshyaQALab'
    if (!isAuthenticated) navigate('/login')

    // Header scroll handling
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (window.innerWidth >= 768) {
            const y = window.scrollY
            setIsScrolled(prev => {
              if (!prev && y > 80) return true
              if (prev && y < 20) return false
              return prev
            })
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isAuthenticated, navigate])

  // --- Interactive Test Area ---
  const checkXpathMatch = () => {
    try {
      // We simulate matching by just searching the tiny local DOM string we'll provide
      // But in this React app, we'll just mock the highlighting for demonstration
      setHighlightedElement(inputXpath.length > 5 ? 'match' : null)
    } catch {
      setHighlightedElement(null)
    }
  }

  // --- Analysis Engine (Professional-Grade Local Heuristic Fixer) ---
  const analyzeXpath = () => {
    if (!inputXpath.trim()) return

    const errors = []
    const suggestions = []
    let fixed = inputXpath.trim()

    // ── Step 0: Gibberish / Non-XPath Detection ──
    const hasSlash = fixed.includes('/')
    const hasBracket = fixed.includes('[')
    const hasAt = fixed.includes('@')
    const isPureAlphaNum = /^[a-zA-Z0-9]+$/.test(fixed)

    if (isPureAlphaNum || (!hasSlash && !hasBracket && !hasAt && fixed.length > 3)) {
      setAnalysis({
        errors: [
          'Critical Error: This is not a valid XPath or CSS locator.',
          "XPath must start with '/' or '//' and use brackets for predicates.",
          `Your input: "${fixed}" contains no recognizable locator structure.`,
        ],
        fixed: 'N/A — Input is not a locator.',
        suggestions: [
          "Relative XPath: //tagName[@attribute='value']",
          'CSS Selector: tagName#id or tagName.className',
          "Data attribute: //*[@data-testid='unique-id']",
        ],
        best5: [
          "//*[@id='element-id']",
          "//*[@data-testid='target']",
          "//button[text()='Click Me']",
          "//input[@name='username']",
          "//*[contains(@class, 'btn-primary')]",
        ],
        isAiGenerated: false,
        isInvalid: true,
      })
      addLog('error', `Rejected invalid locator: ${inputXpath}`)
      return
    }

    // ── Step 1: Strip illegal characters ──
    const illegalChars = fixed.match(/[{}#$%^&*!~`<>|\\]/g)
    if (illegalChars) {
      const unique = [...new Set(illegalChars)]
      errors.push(`Illegal characters removed: ${unique.join(' ')}`)
      fixed = fixed.replace(/[{}#$%^&*!~`<>|\\]/g, '')
    }

    // ── Step 2: Fix common typos ──
    if (fixed.match(/\[test=/)) {
      errors.push('Typo: `test` → `text()`.')
      fixed = fixed.replace(/\[test=/g, '[text()=')
    }
    if (fixed.includes('=,')) {
      errors.push('Syntax Error: `=,` → `=`. Removed extra comma.')
      fixed = fixed.replace(/=,/g, '=')
    }
    if (fixed.includes('contains(text()=')) {
      errors.push('Syntax: `contains(text()=` should use comma separator.')
      fixed = fixed.replace('contains(text()=', 'contains(text(), ')
    }
    if (fixed.includes("contains(@class='")) {
      errors.push("Syntax: `contains(@class='` should use comma separator.")
      fixed = fixed.replace("contains(@class='", "contains(@class, '")
    }

    // ── Step 3: Fix attribute names missing '@' ──
    if (
      fixed.match(/\[(?![@\d])(?!\w+\()(?!text\()(?!contains\()(?!normalize)(?!position)(\w+)=/)
    ) {
      errors.push("Missing '@' prefix on attribute name.")
      fixed = fixed.replace(
        /\[(?![@\d])(?!\w+\()(?!text\()(?!contains\()(?!normalize)(?!position)(\w+)=/g,
        '[@$1='
      )
    }

    // ── Step 4: Balance brackets ──
    let openBrackets = (fixed.match(/\[/g) || []).length
    let closeBrackets = (fixed.match(/\]/g) || []).length
    if (openBrackets !== closeBrackets) {
      errors.push(`Unbalanced brackets: ${openBrackets} open '[' vs ${closeBrackets} close ']'.`)
      // Remove unmatched content after last valid predicate
      // Strategy: keep only well-formed [...] pairs, discard trailing junk
      const parts = fixed.match(/(\/\/[\w.*]+)(\[@?[^\]]*\])*/)
      if (parts) {
        fixed = parts[0]
      }
    }

    // ── Step 5: Balance and fix quotes ──
    const singleQuotes = (fixed.match(/'/g) || []).length
    if (singleQuotes % 2 !== 0) {
      errors.push('Mismatched single quotes — rebalanced.')
      // Try to fix attribute value quoting: [@attr=value'] → [@attr='value']
      fixed = fixed.replace(/([@\w]+=)([^'\]]*)'\]/g, "$1'$2']")
      // If still odd, strip all quotes and re-wrap values
      const stillOdd = (fixed.match(/'/g) || []).length % 2 !== 0
      if (stillOdd) {
        fixed = fixed.replace(/'/g, '')
        // Re-wrap attribute values
        fixed = fixed.replace(/(@[\w-]+=)([^\]]+)/g, "$1'$2'")
      }
    }

    // ── Step 6: Fix text() value quoting ──
    const textMatch = fixed.match(/\[text\(\)=([^\]]+)\]/)
    if (textMatch) {
      let val = textMatch[1].replace(/['"/]/g, '').trim()
      if (val) {
        errors.push('Fixed text() value quoting.')
        fixed = fixed.replace(/\[text\(\)=([^\]]+)\]/, `[text()='${val}']`)
      }
    }

    // ── Step 7: Fix double slashes and path structure ──
    if (fixed.startsWith('/html')) {
      errors.push('Anti-pattern: Absolute path detected. Converted to relative.')
      fixed = fixed.replace(/^\/html\/body\//, '//')
      suggestions.push('Absolute paths break easily. Always prefer relative paths.')
    }
    // Ensure starts with / or //
    if (!fixed.startsWith('/') && !fixed.startsWith('(') && !fixed.startsWith('.')) {
      errors.push("Missing path prefix. Added '//' for relative path.")
      fixed = '//' + fixed
    }

    // ── Step 8: Clean trailing junk ──
    fixed = fixed.replace(/[^\w\])'".*/@\-:()]+$/, '')

    // ── Step 9: Tool-specific suggestions ──
    if (activeTool === 'AppiumAndroid' && !fixed.includes('android.widget')) {
      suggestions.push(
        'Android: Use class names like `//android.widget.Button` for faster lookups.'
      )
    }
    if (fixed.includes('[text()=') && !fixed.includes('normalize-space')) {
      suggestions.push('Pro tip: Use `normalize-space()` instead of `text()` to handle whitespace.')
    }
    if (fixed.match(/\[\d+\]/)) {
      errors.push('Risky: Positional index `[n]` is fragile.')
      suggestions.push('Use a unique parent or attribute instead of positional indexing.')
    }

    // ── Generate alternatives ──
    const valMatch = fixed.match(/['"](.*?)['"]/)
    const tagMatch = fixed.match(/\/\/(\w+)/)
    const tag = tagMatch?.[1] || '*'
    const val = valMatch?.[1] || 'value'

    const best5 = [
      fixed,
      `//*[@data-testid='${val}']`,
      `//${tag}[normalize-space()='${val}']`,
      `//label[text()='Label']/following-sibling::${tag}`,
      `//${tag}[contains(@class, '${val}')]`,
    ]

    setAnalysis({
      errors,
      fixed,
      suggestions: [...new Set(suggestions)],
      best5,
      isAiGenerated: false,
    })
    checkXpathMatch()
    addLog('action', `Local heuristic fix applied to: ${inputXpath}`)
  }

  const askAi = async () => {
    if (!inputXpath.trim()) return

    setIsAiLoading(true)
    setAnalysis(null)

    try {
      const result = await aiService.refactorXpath(inputXpath, activeTool)
      setAnalysis({
        errors: result.issues || [],
        fixed: result.fixed,
        explanation: result.explanation,
        proTip: result.proTip,
        best5: [result.fixed],
        isAiGenerated: true,
      })
      addLog('action', 'AI Refactoring complete (OpenRouter).')
    } catch (err) {
      addLog('error', `OpenRouter Error: ${err.message}`)
      alert(`AI Error: ${err.message}`)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleHtmlExtract = async () => {
    if (!htmlInput.trim()) return
    setIsAiLoading(true)
    setAnalysis(null)
    try {
      const result = await aiService.refactorXpath(
        `Analyze this HTML and extract the 3 best locators for ${activeTool}: ${htmlInput}`,
        activeTool
      )
      setAnalysis({
        errors: [],
        fixed: result.fixed,
        explanation: result.explanation,
        proTip: result.proTip,
        best5: [result.fixed],
        isAiGenerated: true,
      })
      addLog('info', 'HTML analysis complete.')
    } catch (err) {
      addLog('error', `HTML analysis failed: ${err.message}`)
    } finally {
      setIsAiLoading(false)
    }
  }

  const handleVisionUpload = async e => {
    const file = e.target.files[0]
    if (!file) return

    // Validate image professionally
    if (file.size > 5 * 1024 * 1024) {
      addLog('error', 'Vision Error: Image exceeds 5MB limit.')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result.split(',')[1]
      setIsAiLoading(true)
      setAnalysis(null)
      addLog('action', 'Processing screenshot for elements...')
      try {
        const result = await aiService.analyzeVision(base64, activeTool)
        setAnalysis({
          errors: [],
          fixed: result.elements?.[0]?.xpath || 'Select an element',
          explanation: `Identified ${result.elements?.length || 0} locators from screenshot.`,
          proTip: 'Vision analysis works best with clear, high-contrast UI screenshots.',
          best5: result.elements?.map(el => `${el.name}: ${el.xpath}`) || [],
          isAiGenerated: true,
        })
      } catch (err) {
        addLog('error', `Vision Analysis failed: ${err.message}`)
      } finally {
        setIsAiLoading(false)
      }
    }
    reader.readAsDataURL(file)
  }

  if (!isAuthenticated) return null

  return (
    <>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
        {/* Header */}
        <div
          className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'px-0 pt-0' : 'pt-8 px-8'}`}
        >
          <div
            className={`transition-all duration-500 ${isScrolled ? 'max-w-none w-full' : 'max-w-7xl mx-auto'}`}
          >
            <header
              className={`flex justify-between items-center bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-slate-700 transition-all duration-500 ${isScrolled ? 'p-3 px-8 rounded-none' : 'p-5 rounded-2xl'}`}
            >
              <div
                className={`flex items-center justify-between w-full ${isScrolled ? 'max-w-7xl mx-auto' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -ml-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                    data-testid="sidebar-toggle"
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 dark:text-slate-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                  <h1
                    className={`font-black uppercase text-gray-900 dark:text-white transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-2xl'}`}
                  >
                    XPath & Locator Lab
                  </h1>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsApiModalOpen(true)}
                    className="p-2 transition-all hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg group"
                    title="AI Settings"
                  >
                    <svg
                      className="w-5 h-5 text-gray-400 group-hover:text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                    {['Selenium', 'Playwright', 'AppiumAndroid', 'AppiumIOS'].map(tool => (
                      <button
                        key={tool}
                        onClick={() => setActiveTool(tool)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTool === tool ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        {tool === 'AppiumAndroid' ? 'Android' : tool === 'AppiumIOS' ? 'iOS' : tool}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </header>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-8 pt-12 pb-40">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* ────── Left Column: Refactorer ────── */}
            <div className="xl:col-span-2 space-y-8">
              <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    1. Locator Refactorer
                  </h2>
                  <div className="flex bg-gray-50 dark:bg-slate-900 p-1 rounded-lg">
                    {['refactor', 'html', 'vision'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-3 py-1 text-[9px] font-black uppercase transition-all rounded-md ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm' : 'text-gray-400'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {activeTab === 'refactor' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                        Paste your brittle XPath
                      </label>
                      <textarea
                        value={inputXpath}
                        onChange={e => setInputXpath(e.target.value)}
                        placeholder="//div[text()='Submit']"
                        className="w-full h-32 p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                      ></textarea>
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={analyzeXpath}
                        className="flex-1 py-4 border-2 border-blue-600 text-blue-600 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                      >
                        Smart Fix (Local)
                      </button>
                      <button
                        onClick={askAi}
                        disabled={isAiLoading}
                        className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isAiLoading ? (
                          <span className="flex items-center space-x-2">
                            <svg
                              className="animate-spin h-4 w-4 text-white"
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
                            <span>Analyzing...</span>
                          </span>
                        ) : (
                          <span>Ask OpenRouter ✨</span>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'html' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                      Paste HTML Snippet
                    </label>
                    <textarea
                      value={htmlInput}
                      onChange={e => setHtmlInput(e.target.value)}
                      placeholder="<button id='...' class='...'>...</button>"
                      className="w-full h-48 p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl font-mono text-xs outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                    ></textarea>
                    <button
                      onClick={handleHtmlExtract}
                      disabled={isAiLoading}
                      className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isAiLoading ? 'Analyzing HTML...' : 'Extract Locators ✨'}
                    </button>
                  </div>
                )}

                {activeTab === 'vision' && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                    <div className="border-4 border-dashed border-gray-100 dark:border-slate-700 rounded-3xl p-12 text-center transition-all hover:border-blue-500 group">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 group-hover:scale-110 transition-transform">
                        📸
                      </div>
                      <p className="text-sm font-bold text-gray-500 dark:text-slate-400 mb-1">
                        Upload Screenshot
                      </p>
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                        JPG, PNG (MAX 5MB)
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="vision-upload"
                        accept="image/*"
                        onChange={handleVisionUpload}
                      />
                      <button
                        onClick={() => document.getElementById('vision-upload').click()}
                        disabled={isAiLoading}
                        className="mt-6 px-6 py-2 bg-gray-100 dark:bg-slate-700 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
                      >
                        {isAiLoading ? 'Analyzing Screenshot...' : 'Browse Screenshot'}
                      </button>
                    </div>
                  </div>
                )}

                {analysis && (
                  <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {analysis.errors.length > 0 && (
                      <div className="p-4 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase mb-2">
                          Mistakes Caught
                        </h4>
                        <ul className="space-y-1">
                          {analysis.errors.map((err, i) => (
                            <li
                              key={i}
                              className="text-xs text-rose-700 dark:text-rose-400 font-medium"
                            >
                              ❌ {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase">
                          {analysis.isAiGenerated ? 'The AI Optimized Fix' : 'Local Heuristic Fix'}
                        </h4>
                        {analysis.isAiGenerated ? (
                          <span className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded uppercase flex items-center shadow-sm animate-pulse-subtle">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5 animate-ping"></span>
                            AI MODE ACTIVE
                          </span>
                        ) : (
                          <span className="text-[9px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 px-2.5 py-1 rounded uppercase shadow-sm">
                            OFFLINE MODE
                          </span>
                        )}
                      </div>
                      <style>{`
                        @keyframes pulse-subtle {
                          0%, 100% { opacity: 1; }
                          50% { opacity: 0.7; }
                        }
                        .animate-pulse-subtle {
                          animation: pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                        }
                      `}</style>
                      <div className="flex items-center justify-between">
                        <code className="text-sm font-black text-emerald-700 dark:text-emerald-300 break-all">
                          {analysis.fixed}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(analysis.fixed)}
                          className="ml-4 p-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg text-emerald-600"
                        >
                          📋
                        </button>
                      </div>

                      {analysis.explanation && (
                        <div className="mt-6 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-lg">🧠</span>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                              Explanation
                            </h5>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-slate-300 leading-relaxed">
                            {analysis.explanation}
                          </p>
                        </div>
                      )}

                      {analysis.proTip && (
                        <div className="mt-4 p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl">
                          <div className="flex items-center space-x-2 mb-3">
                            <span className="text-lg">⚠️</span>
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-600">
                              Pro Tip (Important)
                            </h5>
                          </div>
                          <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed font-medium">
                            {analysis.proTip}
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase mb-4 tracking-widest">
                        Recommended Robust Alternatives
                      </h4>
                      <div className="space-y-3">
                        {analysis.best5.map((alt, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900 rounded-xl hover:border-blue-500 border border-transparent transition-all group"
                          >
                            <code className="text-[11px] text-gray-600 dark:text-gray-400 font-mono italic">
                              {alt}
                            </code>
                            <span className="text-[9px] font-black bg-white dark:bg-slate-800 text-gray-400 px-2 py-1 rounded uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                              Copy
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>

              <section className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
                <h2 className="text-xl font-black mb-6 uppercase tracking-tighter">
                  2. Interactive Test Area
                </h2>
                <div className="bg-slate-900 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex gap-4 mb-4">
                    <div
                      className={`p-4 rounded-xl border-2 transition-all ${highlightedElement === 'match' ? 'border-amber-400 bg-amber-400/10 scale-105' : 'border-slate-700 bg-slate-800'}`}
                    >
                      <span className="text-xs font-bold text-slate-400">Login Button</span>
                    </div>
                    <div className="p-4 rounded-xl border-2 border-slate-700 bg-slate-800 opacity-50">
                      <span className="text-xs font-bold text-slate-400">Cancel</span>
                    </div>
                  </div>
                  <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    Live DOM Preview (MOCKED)
                  </p>
                  {highlightedElement === 'match' && (
                    <div className="absolute top-2 right-2 bg-amber-400 text-slate-900 text-[9px] font-black px-2 py-1 rounded">
                      MATCHED
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* ────── Right Column: The Cheat Sheet ────── */}
            <div className="space-y-8">
              <section className="bg-indigo-600 dark:bg-indigo-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">
                  Ultimate Locator Guide
                </h2>
                <p className="text-xs text-indigo-100 font-medium leading-relaxed mb-6">
                  Your all-in-one stop for mastering selectors in Selenium, Playwright, and Appium.
                </p>

                <div className="space-y-4">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">
                      Axes Relationships
                    </h4>
                    <div className="font-mono text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span>following-sibling</span>{' '}
                        <span className="text-indigo-200">Sibling after</span>
                      </div>
                      <div className="flex justify-between">
                        <span>preceding-sibling</span>{' '}
                        <span className="text-indigo-200">Sibling before</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ancestor</span> <span className="text-indigo-200">Lookup parent</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/10 rounded-2xl border border-white/20">
                    <h4 className="text-[10px] font-black uppercase tracking-widest mb-2">
                      Mobile (Appium) Syntax
                    </h4>
                    <div className="font-mono text-[10px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-300">Android</span>{' '}
                        <span>resource-id, text</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-rose-300">iOS</span>{' '}
                        <span>accessibility-id, name</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-2xl">
                    <h4 className="text-[10px] font-black uppercase text-amber-400 mb-2 mt-4">
                      Multi-Match Strategy
                    </h4>
                    <p className="text-[11px] leading-relaxed italic">
                      "Matched 2? Don't use [1]. Use a unique parent block:{' '}
                      <code>//div[@id='sidebar']//button</code> is infinitely better than{' '}
                      <code>(//button)[1]</code>."
                    </p>
                  </div>
                </div>

                <div className="absolute -bottom-8 -right-8 opacity-10">
                  <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L1 21h22L12 2zm0 3.45l8.15 14.1H3.85L12 5.45z" />
                  </svg>
                </div>
              </section>

              <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-gray-100 dark:border-slate-700">
                <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-widest">
                  Functions Cheat Sheet
                </h3>
                <div className="space-y-4">
                  <div className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold dark:text-white">
                        normalize-space()
                      </span>
                      <span className="text-[9px] bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded font-black">
                        PRO
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Strips trailing/leading whitespace. Resolves flaky text matches.
                    </p>
                  </div>
                  <div className="group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[11px] font-bold dark:text-white">contains()</span>
                      <span className="text-[9px] bg-emerald-50 text-emerald-500 px-1.5 py-0.5 rounded font-black">
                        CORE
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Partial matches. Use for dynamic classes (e.g. [contains(@class, 'btn')]).
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      <ControlCenter />
      <APIKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onSave={() => {
          setAiConfigured(true)
          addLog('success', 'OpenRouter Engine activated successfully.')
        }}
      />
    </>
  )
}

export default XPathLab

import React, { useState } from 'react'
import { useLogger } from '../../context/LoggerContext'

const AdvancedForms = () => {
  const { addLog } = useLogger()

  // --- Date Picker State ---
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [viewDate, setViewDate] = useState(new Date(2025, 3, 1)) // April 2025

  // --- Range Slider State ---
  const [priceRange, setPriceRange] = useState(500)

  // --- Multi-select Tags State ---
  const [tags, setTags] = useState(['Testing', 'Automation'])
  const [tagInput, setTagInput] = useState('')

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay()

  const handleDateSelect = day => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    setSelectedDate(date)
    setShowCalendar(false)
    addLog('action', `Date selected in custom picker: ${date.toLocaleDateString()}`)
  }

  const handleTagAdd = e => {
    if (e.key === 'Enter' && tagInput.trim()) {
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
        addLog('action', `Tag added: ${tagInput.trim()}`)
      }
      setTagInput('')
    }
  }

  const removeTag = tagToRemove => {
    setTags(tags.filter(t => t !== tagToRemove))
    addLog('action', `Tag removed: ${tagToRemove}`)
  }

  return (
    <div className="space-y-12" id="forms" data-testid="advanced-forms-section">
      {/* 1. CUSTOM DATE PICKER */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-visible relative">
        <div className="p-8 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
            Custom Date Picker
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Stress test calendar navigation and specific day selection in a non-native widget.
          </p>
        </div>

        <div className="p-8">
          <div className="max-w-xs relative overflow-visible">
            <label className="block text-xs font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">
              Select Target Date
            </label>
            <div
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-xl flex items-center justify-between cursor-pointer hover:border-blue-400 transition-colors"
              data-testid="date-picker-input"
            >
              <span
                className={
                  selectedDate ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-400'
                }
              >
                {selectedDate ? selectedDate.toLocaleDateString() : 'Pick a date...'}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            {showCalendar && (
              <div
                className="absolute top-full left-0 mt-3 w-72 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 p-4"
                data-testid="calendar-widget"
              >
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() =>
                      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1))
                    }
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    data-testid="calendar-prev-month"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <span
                    className="font-bold text-sm text-gray-900 dark:text-white"
                    data-testid="calendar-month-year"
                  >
                    {months[viewDate.getMonth()]} {viewDate.getFullYear()}
                  </span>
                  <button
                    onClick={() =>
                      setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1))
                    }
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    data-testid="calendar-next-month"
                  >
                    <svg
                      className="w-4 h-4 text-gray-600 dark:text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center mb-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-[10px] font-black text-gray-400 uppercase">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {[...Array(getFirstDayOfMonth(viewDate.getMonth(), viewDate.getFullYear()))].map(
                    (_, i) => (
                      <div key={`empty-${i}`} />
                    )
                  )}
                  {[...Array(getDaysInMonth(viewDate.getMonth(), viewDate.getFullYear()))].map(
                    (_, i) => {
                      const day = i + 1
                      const isSelected =
                        selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === viewDate.getMonth() &&
                        selectedDate?.getFullYear() === viewDate.getFullYear()
                      return (
                        <button
                          key={day}
                          onClick={() => handleDateSelect(day)}
                          className={`py-2 text-xs font-bold rounded-lg transition-all ${isSelected ? 'bg-blue-600 text-white' : 'hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-slate-300'}`}
                          data-testid={`calendar-day-${day}`}
                        >
                          {day}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 2. RANGE SLIDER */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Smart Range Slider
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Test drag interaction and dynamic numerical verification.
          </p>

          <div className="bg-gray-50 dark:bg-slate-900/50 p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-gray-400">
                Budget Limit
              </span>
              <span
                className="text-lg font-black text-blue-600 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-xl"
                data-testid="slider-value"
              >
                ${priceRange}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              step="50"
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
              className="w-full h-2 bg-gray-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              data-testid="price-slider"
            />
            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              <span>$0</span>
              <span>$500</span>
              <span>$1000</span>
            </div>
          </div>
        </div>

        {/* 3. MULTI-SELECT TAGS */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-2">
            Tagging Input
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Test keystroke interactions (Enter to add) and DOM element removal.
          </p>

          <div className="bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-700">
            <div className="flex flex-wrap gap-2 mb-3" data-testid="tag-container">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-full text-xs font-bold text-gray-700 dark:text-slate-300 flex items-center gap-2 group"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-rose-500 transition-colors"
                    data-testid={`remove-tag-${tag.toLowerCase()}`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Type tag and press Enter..."
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagAdd}
              className="w-full bg-transparent border-none outline-none text-sm p-2 text-gray-900 dark:text-white"
              data-testid="tag-input"
            />
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-blue-600 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-lg">
            💡
          </div>
          <p className="text-xs font-medium leading-relaxed max-w-sm">
            Can your automation select **April 15, 2025** on the calendar? Try targeting by Month
            name navigation first.
          </p>
        </div>
        <div className="bg-white/10 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20">
          Complexity: Advanced Interactions
        </div>
      </div>
    </div>
  )
}

export default AdvancedForms

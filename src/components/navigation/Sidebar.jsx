import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { name: 'Dashboard Home', path: '/dashboard', icon: '🏠', category: 'Core' },
    { name: 'Data Management', path: '/dashboard#data-table', icon: '📊', category: 'Testing' },
    { name: 'File Operations', path: '/dashboard#file-upload', icon: '📁', category: 'Testing' },
    { name: 'Chaos Form', path: '/dashboard#chaos-form', icon: '⚡', category: 'Stress Testing' },
    { name: 'Component Sandbox', path: '/sandbox', icon: '🧪', category: 'Advanced Scenarios' },
    {
      name: 'Product Gallery',
      path: '/sandbox#products',
      icon: '🛍️',
      category: 'Advanced Scenarios',
    },
    {
      name: 'Date & Form Pickers',
      path: '/sandbox#forms',
      icon: '📅',
      category: 'Advanced Scenarios',
    },
  ]

  const categories = [...new Set(menuItems.map(item => item.category))]

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white dark:bg-slate-900 shadow-2xl z-[80] transition-transform duration-300 ease-in-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        data-testid="navigation-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                QA
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Lab Hub</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto p-4 py-6 scrollbar-thin">
            {categories.map(cat => (
              <div key={cat} className="mb-6">
                <h3 className="px-4 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-slate-500 mb-2">
                  {cat}
                </h3>
                <div className="space-y-1">
                  {menuItems
                    .filter(item => item.category === cat)
                    .map(item => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) => `
                        flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                        }
                      `}
                        data-testid={`nav-item-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <span className="text-base">{item.icon}</span>
                        {item.name}
                      </NavLink>
                    ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-slate-800">
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4">
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-mono mb-1">
                AUTOMATION STATUS
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-700 dark:text-slate-300">
                  Hub Ready for Stress
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

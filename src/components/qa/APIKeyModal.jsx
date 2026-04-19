import React, { useState } from 'react'
import { aiService } from '../../services/aiService'

const MODELS = [
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash', type: 'Vision/Ultra-Fast' },
  { id: 'google/gemini-pro-1.5', name: 'Gemini Pro 1.5', type: 'Reasoning' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', type: 'Stable/Accurate' },
  { id: 'anthropic/claude-3-haiku:free', name: 'Claude 3 Haiku (Free)', type: 'Fast/Expert' },
  {
    id: 'meta-llama/llama-3.1-405b-instruct:free',
    name: 'Llama 3.1 405B (Free)',
    type: 'Open Source',
  },
  { id: 'mistralai/mistral-7b-instruct:free', name: 'Mistral 7B (Free)', type: 'Efficient' },
]

const APIKeyModal = ({ isOpen, onClose, onSave }) => {
  const [key, setKey] = useState(localStorage.getItem('OPENROUTER_API_KEY') || '')
  const [model, setModel] = useState(localStorage.getItem('AI_MODEL') || MODELS[0].id)

  if (!isOpen) return null

  const handleSave = () => {
    aiService.setApiKey(key)
    aiService.setModel(model)
    onSave()
    onClose()
  }

  const handleReset = () => {
    setKey('')
    aiService.setApiKey('')
    onSave()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl shadow-lg shadow-indigo-500/20">
              ⚡
            </div>
            <div>
              <h3 className="text-xl font-black dark:text-white uppercase tracking-tighter">
                OpenRouter Engine
              </h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Unified AI Integration
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                OpenRouter API Key
              </label>
              <input
                type="password"
                value={key}
                onChange={e => setKey(e.target.value)}
                placeholder="sk-or-v1-..."
                className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl font-mono text-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white shadow-inner"
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[10px] text-gray-400 leading-relaxed italic">
                  {key ? 'Using Custom Override Key' : 'Using Community Default Engine'}
                </p>
                {key && (
                  <button
                    onClick={handleReset}
                    className="text-[9px] font-black uppercase text-rose-500 hover:text-rose-600 transition-colors"
                  >
                    Reset to Default
                  </button>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">
                Preferred Model
              </label>
              <select
                value={model}
                onChange={e => setModel(e.target.value)}
                className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white appearance-none cursor-pointer"
              >
                {MODELS.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.type}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3 pt-6 border-t border-gray-100 dark:border-slate-700">
              <button
                onClick={onClose}
                className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
              >
                Activate Engine
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default APIKeyModal

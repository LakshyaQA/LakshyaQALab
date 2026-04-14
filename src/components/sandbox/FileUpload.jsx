import React, { useState, useRef } from 'react'
import { useNetwork } from '../../context/NetworkContext'
import { useLogger } from '../../context/LoggerContext'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

const FileUpload = () => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [uploadState, setUploadState] = useState('idle') // idle, uploading, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const [progress, setProgress] = useState(0)

  const inputRef = useRef(null)
  const { mockFetch } = useNetwork()
  const { addLog } = useLogger()

  const handleDrag = e => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const simulateUploadProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval)
          return 90 // Wait for mockFetch to complete for 100%
        }
        return prev + 10
      })
    }, 200)
    return interval
  }

  const processFile = async selectedFile => {
    setErrorMessage('')

    // Negative testing target: Size validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadState('error')
      setErrorMessage(
        `File exceeds 5MB size limit (${(selectedFile.size / 1024 / 1024).toFixed(2)}MB).`
      )
      addLog('error', 'File Upload Failed: Exceeded Max Size', { size: selectedFile.size })
      return
    }

    setFile(selectedFile)
    setUploadState('uploading')
    addLog('action', `File Upload Initiated: ${selectedFile.name}`)

    const progressInterval = simulateUploadProgress()

    try {
      // Simulate file upload API call
      await mockFetch('/api/v1/storage/upload')

      clearInterval(progressInterval)
      setProgress(100)
      setUploadState('success')
      addLog('info', `File Upload Successful: ${selectedFile.name}`)
    } catch (err) {
      clearInterval(progressInterval)
      setUploadState('error')
      setErrorMessage(err.message)
      addLog('error', `File Upload API rejected: ${err.message}`)
    }
  }

  const handleDrop = async e => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = async e => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0])
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadState('idle')
    setErrorMessage('')
    setProgress(0)
    addLog('action', 'File Upload Component Reset')
  }

  return (
    <div
      id="file-upload"
      className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden col-span-1 h-96 flex flex-col"
    >
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
        <h3 className="font-semibold text-gray-800 dark:text-slate-200 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-teal-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
          Upload Dropzone
        </h3>
        <span className="text-xs text-teal-600 dark:text-teal-400 font-mono bg-teal-50 dark:bg-teal-900/30 px-2 py-1 rounded">
          Validation Target
        </span>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-center">
        {uploadState === 'idle' && (
          <form
            onDragEnter={handleDrag}
            onSubmit={e => e.preventDefault()}
            className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all duration-300 ${dragActive ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' : 'border-gray-300 dark:border-slate-700 hover:border-gray-400 dark:hover:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-800/50'}`}
            data-testid="upload-dropzone"
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleChange}
              data-testid="upload-input"
            />
            <div className="text-center pointer-events-none p-6">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 dark:text-slate-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300">
                Drag & drop files or{' '}
                <span
                  className="text-teal-500 underline cursor-pointer pointer-events-auto"
                  onClick={() => inputRef.current.click()}
                >
                  Browse
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-500 mt-2 font-mono">
                Max size: 5MB. All types accepted for testing.
              </p>
            </div>
            {dragActive && (
              <div
                className="absolute inset-0 z-10"
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                data-testid="upload-overlay"
              ></div>
            )}
          </form>
        )}

        {uploadState === 'uploading' && (
          <div
            className="flex-1 flex flex-col items-center justify-center"
            data-testid="upload-progress-state"
          >
            <div className="w-16 h-16 relative mb-4">
              <svg
                className="animate-spin text-teal-500 w-full h-full"
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
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-slate-200 mb-2 truncate max-w-xs">
              {file?.name}
            </p>
            <div className="w-full max-w-xs bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
              <div
                className="bg-teal-600 h-2.5 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {uploadState === 'success' && (
          <div
            className="flex-1 flex flex-col items-center justify-center border-2 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl"
            data-testid="upload-success-state"
          >
            <svg
              className="w-16 h-16 text-emerald-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-emerald-700 dark:text-emerald-400 font-semibold mb-1">
              Upload Complete
            </p>
            <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 font-mono mb-4 truncate px-4">
              {file?.name}
            </p>
            <button
              onClick={resetUpload}
              className="text-sm font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
              data-testid="upload-reset-btn"
            >
              Upload Another
            </button>
          </div>
        )}

        {uploadState === 'error' && (
          <div
            className="flex-1 flex flex-col items-center justify-center border-2 border-rose-500/50 bg-rose-50 dark:bg-rose-950/20 rounded-xl p-6 text-center"
            data-testid="upload-error-state"
          >
            <svg
              className="w-12 h-12 text-rose-500 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-rose-700 dark:text-rose-400 font-semibold text-sm mb-1">
              Upload Rejected
            </p>
            <p className="text-xs text-rose-600 dark:text-rose-400/80 mb-4">{errorMessage}</p>
            <button
              onClick={resetUpload}
              className="px-4 py-2 bg-rose-600 text-white text-sm rounded hover:bg-rose-700 transition-colors"
              data-testid="upload-retry-btn"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUpload

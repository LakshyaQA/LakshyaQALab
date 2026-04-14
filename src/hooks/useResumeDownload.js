import { useToast } from '../context/ToastContext'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants/messages'

export const useResumeDownload = () => {
  const { addToast } = useToast()

  const handleDownload = async (url, customFilename) => {
    const filename = customFilename || url.split('/').pop() || 'Resume.pdf'
    try {
      // 1. Verify file existence and content type before initiating download
      const response = await fetch(url, { method: 'HEAD' })

      const contentType = response.headers.get('content-type')
      if (!response.ok || (contentType && contentType.includes('text/html'))) {
        throw new Error('File not found or server returned HTML fallback')
      }

      // 2. Initiate download using a hidden anchor tag
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // 3. Show a random success message
      const randomSuccess = SUCCESS_MESSAGES[Math.floor(Math.random() * SUCCESS_MESSAGES.length)]
      addToast(randomSuccess, 'success')
    } catch (error) {
      console.error('Download failed:', error)

      // 4. Show a random creative error message
      const randomError = ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
      addToast(randomError, 'error', 7000)
    }
  }

  return { handleDownload }
}

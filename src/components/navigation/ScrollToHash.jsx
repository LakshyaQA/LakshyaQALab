import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToHash = () => {
  const { hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1))
      if (element) {
        // Simple timeout to ensure the element is rendered if coming from another page
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }
    }
  }, [hash])

  return null
}

export default ScrollToHash

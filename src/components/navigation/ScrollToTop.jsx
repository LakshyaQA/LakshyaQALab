import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Component that resets scroll position to top on every route change.
 * This ensures that when navigating from the bottom of one page,
 * the new page starts at the top.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Reset window scroll to top
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

export default ScrollToTop

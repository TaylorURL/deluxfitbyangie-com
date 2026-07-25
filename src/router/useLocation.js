import { useCallback, useEffect, useState } from 'react'

/**
 * Returns the current pathname + hash and a `navigate(href)` setter that uses
 * pushState so back/forward keep working.
 */
function readLocation() {
  if (typeof window === 'undefined') {
    return { pathname: '/', hash: '' }
  }
  return { pathname: window.location.pathname || '/', hash: window.location.hash || '' }
}

export function useLocation() {
  const [location, setLocation] = useState(readLocation)

  useEffect(() => {
    const onPop = () => setLocation(readLocation())
    window.addEventListener('popstate', onPop)
    window.addEventListener('df:navigate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('df:navigate', onPop)
    }
  }, [])

  const navigate = useCallback((href, { replace = false } = {}) => {
    if (typeof window === 'undefined' || !href) return
    if (replace) {
      window.history.replaceState({}, '', href)
    } else {
      window.history.pushState({}, '', href)
    }
    window.dispatchEvent(new Event('df:navigate'))
  }, [])

  return { ...location, navigate }
}

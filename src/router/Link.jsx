import { forwardRef } from 'react'
import { useLocation } from './useLocation'

const EXTERNAL_PATTERN = /^([a-z][a-z0-9+.-]*:|\/\/|mailto:|tel:)/i

export const Link = forwardRef(function Link(
  { href, onClick, target, replace = false, children, ...props },
  ref
) {
  const { pathname, navigate } = useLocation()

  const isExternal = typeof href === 'string' && EXTERNAL_PATTERN.test(href)
  const isTargetBlank = target === '_blank'

  const handleClick = event => {
    if (onClick) onClick(event)
    if (event.defaultPrevented) return
    if (!href || isExternal || isTargetBlank) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
      return
    }
    event.preventDefault()
    const [path, hash] = href.split('#')
    const targetPath = path || pathname
    if (targetPath === pathname && hash) {
      window.history.replaceState({}, '', `${pathname}#${hash}`)
      const target = document.getElementById(hash)
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      return
    }
    navigate(href, { replace })
    if (hash) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
    }
  }

  return (
    <a ref={ref} href={href} target={target} onClick={handleClick} {...props}>
      {children}
    </a>
  )
})

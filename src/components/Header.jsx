import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button, Container } from '@deluxfit/ds'
import { brand, nav } from '@/content/site'
import { cn } from '@/lib/cn'

/**
 * Sticky site header. Gains an elevated, blurred background once the page is
 * scrolled, and collapses the anchor nav into a toggle sheet on mobile.
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-sticky transition-colors duration-300 ease-df-out',
        scrolled
          ? 'border-b border-df-border bg-df-bg/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <Container size="xl">
        <div className="flex h-16 items-center justify-between sm:h-20">
          <a
            href="#top"
            className="font-display text-2xl font-700 uppercase tracking-tight text-df-text"
          >
            {brand.name}
            <span className="text-df-accent-bright">.</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {nav.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-500 text-df-text-muted transition-colors hover:text-df-text"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="sm">
              <a href="#pricing">Get Started</a>
            </Button>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-df-sm text-df-text md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <div className="border-t border-df-border bg-df-bg/95 backdrop-blur-xl md:hidden">
          <Container size="xl">
            <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
              {nav.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-df-sm px-2 py-3 text-base font-500 text-df-text-muted transition-colors hover:bg-df-surface-2 hover:text-df-text"
                >
                  {item.label}
                </a>
              ))}
              <Button asChild size="md" block className="mt-2" onClick={closeMenu}>
                <a href="#pricing">Get Started</a>
              </Button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}

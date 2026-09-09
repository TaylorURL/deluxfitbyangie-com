import { Component } from 'react'
import { Button } from '@deluxfit/ds'
import { isChunkLoadError, reloadForCurrentBuild } from '@/lib/chunk'

/*
 * The last thing between a thrown render and an empty document.
 *
 * React unmounts the entire tree when a render throws with nothing above it to
 * catch the throw, and the reader is left looking at the background colour with
 * no way to tell that anything happened. That is worth catching whatever threw,
 * but the case it is here for is a chunk the build no longer has: the reader is
 * running a build that has been replaced, so this asks for the current document
 * and only draws when that cannot be done.
 *
 * It sits above the language provider, so it cannot read its copy from the
 * content tree — the tree is itself a chunk, and a reader who switched to
 * Spanish across a deploy is exactly who ends up here. The two strings are
 * taken off the document's own language instead.
 */

const COPY = {
  en: {
    heading: 'Something went wrong',
    body: 'This page did not finish loading.',
    action: 'Reload the Page',
  },
  es: {
    heading: 'Algo salió mal',
    body: 'Esta página no terminó de cargarse.',
    action: 'Recargar la Página',
  },
}

function copyForDocument() {
  if (typeof document === 'undefined') return COPY.en
  const lang = String(document.documentElement.lang || 'en')
    .toLowerCase()
    .split('-')[0]
  return COPY[lang] ?? COPY.en
}

export default class AppErrorBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    /*
     * A chunk that has gone is recoverable and nothing else here is, so this is
     * the one error that does not draw. `reloadForCurrentBuild` allows itself
     * one reload per visit; when it declines, the fallback below is what the
     * reader gets, and its button is the same reload under their own hand.
     */
    if (isChunkLoadError(error)) reloadForCurrentBuild()
  }

  render() {
    if (!this.state.failed) return this.props.children

    const { heading, body, action } = copyForDocument()

    return (
      <section className="flex min-h-dvh flex-col items-center justify-center bg-df-bg px-6 text-center">
        <h1 className="font-display text-[clamp(2rem,6vw,3.5rem)] uppercase leading-[0.9] tracking-[-0.015em] text-df-text">
          {heading}
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-df-text-muted">{body}</p>
        <Button size="lg" className="mt-8" onClick={() => window.location.reload()}>
          {action}
        </Button>
      </section>
    )
  }
}

/**
 * Drive a frame callback only while its element is on screen and the tab is
 * visible.
 *
 * A canvas loop that re-queues itself unconditionally holds a wake every 16ms
 * for the length of the visit and competes with every interaction on the page,
 * including while it is drawing something nobody can see — the particle field
 * three screens below the fold, or the whole page behind a backgrounded tab.
 * Intersection covers the first case and `visibilitychange` the second, which
 * the observer does not report on its own.
 *
 * @param {HTMLElement} element - the element whose visibility gates the loop
 * @param {(t: number, resumed: boolean) => void} draw - the frame callback.
 *   `resumed` is true on the first frame after a pause, so a loop that
 *   integrates a per-frame delta can rebase its clock instead of applying the
 *   whole pause as one step.
 * @returns {() => void} stops the loop and releases its observers
 */
export function framePump(element, draw) {
  let frame = 0
  let onScreen = false
  let resumed = true

  const tick = t => {
    frame = requestAnimationFrame(tick)
    const first = resumed
    resumed = false
    draw(t, first)
  }

  const sync = () => {
    const shouldRun = onScreen && document.visibilityState !== 'hidden'
    if (shouldRun) {
      if (!frame) frame = requestAnimationFrame(tick)
    } else if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
      resumed = true
    }
  }

  const observer = new IntersectionObserver(
    entries => {
      onScreen = entries.some(entry => entry.isIntersecting)
      sync()
    },
    { threshold: 0 }
  )
  observer.observe(element)
  document.addEventListener('visibilitychange', sync)

  return () => {
    if (frame) cancelAnimationFrame(frame)
    frame = 0
    observer.disconnect()
    document.removeEventListener('visibilitychange', sync)
  }
}

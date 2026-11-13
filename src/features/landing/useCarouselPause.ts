import { useEffect, useState, type FocusEvent, type MouseEvent } from 'react'

// Parts of a slide people read or click. Hovering them pauses the slider; hovering the background
// photo does not (the slider fills the whole first screen, so that would stop it almost always).
const READ_OR_CLICK = 'h1, h2, p, a, button, [role="button"], .hero-carousel-copy, .hero-carousel-navigation, .mobile-hero-content'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

// Auto-advance stops while the visitor reads a slide (pointer on its text or buttons), while the
// keyboard focus is inside the slider, and always when the device asks for reduced motion.
export function useCarouselPause() {
  const [pointerOnContent, setPointerOnContent] = useState(false)
  const [focusInside, setFocusInside] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return
    const sync = () => setReducedMotion(media.matches)
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const handlers = {
    onBlur: (event: FocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocusInside(false)
    },
    onFocus: () => setFocusInside(true),
    onMouseLeave: () => setPointerOnContent(false),
    onMouseOver: (event: MouseEvent<HTMLElement>) => {
      const target = event.target instanceof Element ? event.target : null
      setPointerOnContent(Boolean(target?.closest(READ_OR_CLICK)))
    },
  }

  return { paused: pointerOnContent || focusInside || reducedMotion, pauseHandlers: handlers }
}

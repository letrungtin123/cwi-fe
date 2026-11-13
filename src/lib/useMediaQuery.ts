import { useEffect, useState } from 'react'

// True while the CSS media query matches; follows window resizes, zoom and rotation.
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => typeof window !== 'undefined' && window.matchMedia?.(query).matches === true)

  useEffect(() => {
    const media = window.matchMedia?.(query)
    if (!media) return
    const sync = () => setMatches(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [query])

  return matches
}

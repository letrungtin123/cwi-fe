import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from 'react'
import { useNewsNavigate, withLanguage } from './newsRouting'

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.defaultPrevented
}

// A real link (open in a new tab, copy link address) that moves between news pages without
// reloading the site.
export function NewsLink({ children, to, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode; to: string }) {
  const navigate = useNewsNavigate()
  return (
    <a
      {...props}
      href={withLanguage(to)}
      onClick={(event) => {
        props.onClick?.(event)
        if (!isPlainLeftClick(event)) return
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}

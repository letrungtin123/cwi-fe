import { useEffect, useRef, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

// Several dialogs can be open at once (the download form over the report viewer) and can close in
// any order, even in the same render. Count the locks and restore the page scroll only when the
// last one is released, so the page is never left unscrollable.
let scrollLocks = 0
let overflowBeforeLock = ''

function lockPageScroll() {
  if (scrollLocks === 0) overflowBeforeLock = document.body.style.overflow
  scrollLocks += 1
  document.body.style.overflow = 'hidden'
}

function unlockPageScroll() {
  scrollLocks = Math.max(0, scrollLocks - 1)
  if (scrollLocks === 0) document.body.style.overflow = overflowBeforeLock
}

export type DialogKeyboardOptions = {
  // Element that gets focus once the dialog has opened.
  initialFocusRef?: RefObject<HTMLElement | null>
  // Escape was pressed. Leave it out (or ignore the call) when Escape must not close the dialog.
  onEscape?: () => void
  // Any other key, e.g. arrows in an image viewer. Runs before the Tab focus trap.
  onKeyDown?: (event: KeyboardEvent) => void
  // Stop the page behind the dialog from scrolling (default true).
  lockScroll?: boolean
  // Another dialog is open on top of this one: leave every key to that dialog.
  suspended?: boolean
}

// Keyboard behaviour shared by the site's dialogs while `open` is true: Escape, focus kept inside
// the dialog with Tab / Shift+Tab, page scroll locked, and focus returned to where it was on close.
// Callbacks are read through a ref, so re-renders never re-run the setup (which would steal focus).
export function useDialogKeyboard(open: boolean, dialogRef: RefObject<HTMLElement | null>, options: DialogKeyboardOptions = {}) {
  const optionsRef = useRef(options)
  useEffect(() => {
    optionsRef.current = options
  })

  useEffect(() => {
    if (!open) return
    const { initialFocusRef, lockScroll = true } = optionsRef.current
    const previousFocus = document.activeElement as HTMLElement | null
    if (lockScroll) lockPageScroll()
    const frame = window.requestAnimationFrame(() => (initialFocusRef?.current ?? dialogRef.current)?.focus())

    const handleKeyDown = (event: KeyboardEvent) => {
      const current = optionsRef.current
      if (current.suspended) return
      if (event.key === 'Escape') {
        if (current.onEscape) {
          event.preventDefault()
          current.onEscape()
        }
        return
      }
      current.onKeyDown?.(event)
      if (event.key !== 'Tab' || event.defaultPrevented || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((element) => element.getClientRects().length > 0 || element === document.activeElement)
      if (!focusable.length) return
      const first = focusable[0]!
      const last = focusable[focusable.length - 1]!
      const active = document.activeElement
      if (event.shiftKey && (active === first || !dialogRef.current.contains(active))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !dialogRef.current.contains(active))) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('keydown', handleKeyDown)
      if (lockScroll) unlockPageScroll()
      window.requestAnimationFrame(() => previousFocus?.focus())
    }
  }, [dialogRef, open])
}

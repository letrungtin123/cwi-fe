import { act, fireEvent, render, screen } from '@testing-library/react'
import { useRef, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useDialogKeyboard } from './useDialogKeyboard'

const nextFrame = () => act(() => new Promise((resolve) => window.requestAnimationFrame(() => resolve(undefined))))

// jsdom has no layout: make every element count as visible for the focus trap.
Element.prototype.getClientRects = function getClientRects() {
  return [{}] as unknown as DOMRectList
}

function Harness({ onEscape }: { onEscape: () => void }) {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const firstRef = useRef<HTMLInputElement>(null)
  useDialogKeyboard(open, dialogRef, { initialFocusRef: firstRef, onEscape: () => { onEscape(); setOpen(false) } })
  return (
    <>
      <button onClick={() => setOpen(true)} type="button">Mở</button>
      {open ? (
        <div ref={dialogRef} role="dialog">
          <input aria-label="Tên" ref={firstRef} />
          <button disabled type="button">Không bấm được</button>
          <button type="button">Gửi</button>
        </div>
      ) : null}
    </>
  )
}

function Stacked({ onOuterEscape, onInnerEscape }: { onOuterEscape: () => void; onInnerEscape: () => void }) {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const innerFieldRef = useRef<HTMLInputElement>(null)
  // The viewer stays open underneath while the download form is on top (quarterly report page).
  useDialogKeyboard(true, outerRef, { onEscape: onOuterEscape, suspended: true })
  useDialogKeyboard(true, innerRef, { initialFocusRef: innerFieldRef, onEscape: onInnerEscape })
  return (
    <>
      <div ref={outerRef} role="dialog" aria-label="viewer"><button type="button">Đóng báo cáo</button></div>
      <div ref={innerRef} role="dialog" aria-label="form"><input aria-label="Họ tên" ref={innerFieldRef} /><button type="button">Tải</button></div>
    </>
  )
}

describe('useDialogKeyboard', () => {
  it('leaves keys to the dialog on top while it is open', async () => {
    const onOuterEscape = vi.fn()
    const onInnerEscape = vi.fn()
    render(<Stacked onInnerEscape={onInnerEscape} onOuterEscape={onOuterEscape} />)
    await nextFrame()
    const download = screen.getByRole('button', { name: 'Tải' })
    download.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(screen.getByLabelText('Họ tên')) // stays in the form, not pulled to the viewer
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onInnerEscape).toHaveBeenCalledTimes(1)
    expect(onOuterEscape).not.toHaveBeenCalled()
  })

  it('focuses the first field, traps Tab, closes on Escape and gives focus back', async () => {
    const onEscape = vi.fn()
    render(<Harness onEscape={onEscape} />)
    const opener = screen.getByRole('button', { name: 'Mở' })
    opener.focus()
    fireEvent.click(opener)
    await nextFrame()

    const name = screen.getByLabelText('Tên')
    const send = screen.getByRole('button', { name: 'Gửi' })
    expect(document.activeElement).toBe(name)
    expect(document.body.style.overflow).toBe('hidden')

    send.focus()
    fireEvent.keyDown(window, { key: 'Tab' })
    expect(document.activeElement).toBe(name) // wraps to the start, skipping the disabled button

    name.focus()
    fireEvent.keyDown(window, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(send) // wraps to the end

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onEscape).toHaveBeenCalledTimes(1)
    await nextFrame()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('')
    expect(document.activeElement).toBe(opener)
  })
})

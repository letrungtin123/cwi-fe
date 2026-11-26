import { describe, expect, it } from 'vitest'
import { shownShareButtons } from './newsShare'

describe('news share buttons', () => {
  it('shows every button when the answer has no setting', () => {
    expect(shownShareButtons(undefined, true)).toEqual(['facebook', 'linkedin', 'copyLink', 'native'])
  })

  it('hides the buttons switched off and the share sheet where the browser has none', () => {
    const share = { copyLink: true, facebook: false, linkedin: true, native: true }
    expect(shownShareButtons(share, true)).toEqual(['linkedin', 'copyLink', 'native'])
    expect(shownShareButtons(share, false)).toEqual(['linkedin', 'copyLink'])
    expect(shownShareButtons({ copyLink: false, facebook: false, linkedin: false, native: true }, false)).toEqual([])
  })
})

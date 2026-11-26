import { describe, expect, it } from 'vitest'
import { newsPageIcons } from './newsShare'

describe('icons beside a post', () => {
  it('shows only the copy-link icon when the answer has no setting', () => {
    expect(newsPageIcons({})).toEqual({ copyLink: true, social: [] })
  })

  it('keeps CWI pages in the given order and the copy-link switch', () => {
    const social = [{ network: 'facebook', url: 'https://facebook.com/cwi' }, { network: 'zalo', url: 'https://zalo.me/123' }]
    expect(newsPageIcons({ copyLink: false, social })).toEqual({ copyLink: false, social })
  })

  it('drops anything that is not an https link to a known network', () => {
    expect(newsPageIcons({
      social: [
        { network: 'facebook', url: 'javascript:alert(1)' },
        { network: 'tiktok', url: 'https://tiktok.com/@cwi' },
        { network: 'youtube', url: 'http://youtube.com/@cwi' },
        null,
        { network: 'linkedin', url: 'https://www.linkedin.com/company/cwi' },
      ],
    }).social).toEqual([{ network: 'linkedin', url: 'https://www.linkedin.com/company/cwi' }])
  })
})

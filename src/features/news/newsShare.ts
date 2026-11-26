// Share buttons on a post page, as chosen in the dashboard ("Tin tức" -> "Cài đặt").
export type NewsShareSettings = { copyLink: boolean; facebook: boolean; linkedin: boolean; native: boolean }
export type NewsShareButton = keyof NewsShareSettings

// Answers cached before the setting existed carry none: every button, as before.
export const DEFAULT_NEWS_SHARE: NewsShareSettings = { copyLink: true, facebook: true, linkedin: true, native: true }

const ORDER: NewsShareButton[] = ['facebook', 'linkedin', 'copyLink', 'native']

// The phone's share sheet only exists in some browsers, so it also needs canNativeShare.
export function shownShareButtons(share: NewsShareSettings | undefined, canNativeShare: boolean): NewsShareButton[] {
  const settings = share ?? DEFAULT_NEWS_SHARE
  return ORDER.filter((button) => settings[button] && (button !== 'native' || canNativeShare))
}

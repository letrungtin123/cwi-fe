// The icons beside a post, as set in the dashboard ("Tin tức" -> "Cài đặt"): CWI's own page
// on each network, then one icon that copies the post's link.
export const NEWS_SOCIAL_NETWORKS = ['facebook', 'linkedin', 'youtube', 'zalo'] as const
export type NewsSocialNetwork = (typeof NEWS_SOCIAL_NETWORKS)[number]
export type NewsSocialLink = { network: NewsSocialNetwork; url: string }
export type NewsPageIcons = { copyLink: boolean; social: NewsSocialLink[] }

const isNetwork = (value: unknown): value is NewsSocialNetwork => NEWS_SOCIAL_NETWORKS.includes(value as NewsSocialNetwork)

function safeUrl(value: unknown) {
  if (typeof value !== 'string') return null
  try {
    return new URL(value).protocol === 'https:' ? value : null
  } catch {
    return null
  }
}

// From the post answer. One cached from before the setting has neither field: the
// copy-link icon alone. Only https links to a known network are kept.
export function newsPageIcons(answer: { copyLink?: unknown; social?: unknown }): NewsPageIcons {
  const social = Array.isArray(answer.social)
    ? answer.social.flatMap((item: unknown) => {
      const { network, url } = (item ?? {}) as { network?: unknown; url?: unknown }
      const href = safeUrl(url)
      return isNetwork(network) && href ? [{ network, url: href }] : []
    })
    : []
  return { copyLink: answer.copyLink !== false, social }
}

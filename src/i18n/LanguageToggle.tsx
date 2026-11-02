import type { ReactNode } from 'react'
import { getLang, setLang, type Lang } from '.'

const targets: Record<Lang, { code: string; label: string; lang: Lang }> = {
  en: { code: 'VI', label: 'Chuyển sang tiếng Việt', lang: 'vi' },
  vi: { code: 'EN', label: 'Switch to English', lang: 'en' },
}

// Shows the language it switches to, as in the Figma header ("EN" on the Vietnamese page).
export function LanguageToggle({ children, className }: { children?: ReactNode; className?: string }) {
  const target = targets[getLang()]
  return (
    <button
      aria-label={target.label}
      className={className}
      lang={target.lang}
      onClick={() => setLang(target.lang)}
      title={target.label}
      type="button"
    >
      {children ?? target.code}
    </button>
  )
}

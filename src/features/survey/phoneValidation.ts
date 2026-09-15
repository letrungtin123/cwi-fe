const compactPhonePattern = /[\s().-]/g

export function normalizePhone(value: string) {
  const compact = value.trim().replace(compactPhonePattern, '')

  if (/^0\d{9,10}$/.test(compact)) return `+84${compact.slice(1)}`
  if (/^\+[1-9]\d{7,14}$/.test(compact)) return compact

  return ''
}

export function isValidPhone(value: string) {
  return Boolean(normalizePhone(value))
}

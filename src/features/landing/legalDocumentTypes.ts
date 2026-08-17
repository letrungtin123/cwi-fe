export type LegalDocumentBlock =
  | { type: 'paragraph'; text: string; emphasis?: boolean }
  | { type: 'list'; items: string[] }

export type LegalDocumentSection = {
  id: string
  title: string
  blocks: LegalDocumentBlock[]
}

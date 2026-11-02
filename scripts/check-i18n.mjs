// Checks the EN translations of the landing.
//   node scripts/check-i18n.mjs            -> every t()/tx() key with a literal argument must exist in src/i18n/en
//   node scripts/check-i18n.mjs --unwrapped [path...]
//                                          -> also lists Vietnamese text that is not inside t()/tx()
//                                             (values such as option text are expected there; review by hand)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const args = process.argv.slice(2)
const showUnwrapped = args.includes('--unwrapped')
const paths = args.filter((a) => !a.startsWith('--'))
const VI = /[ăâđêôơưàảãáạằẳẵắặầẩẫấậèẻẽéẹềểễếệìỉĩíịòỏõóọồổỗốộờởỡớợùủũúụừửữứựỳỷỹýỵĂÂĐÊÔƠƯÀÁẠẢÃÈÉỀẾỂỄỆÌÍÒÓỒỐỔỖỘỜỚỞỠỢÙÚỤỦŨỪỨỬỮỰỲÝ]/

const collapse = (s) => s.replace(/\s+/g, ' ').trim()
const parse = (file) => ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    return statSync(full).isDirectory() ? listFiles(full) : /\.(ts|tsx)$/.test(name) ? [full] : []
  })
}

// Dictionary keys: property names of the object literals in src/i18n/en/*.ts.
const dictDir = join(root, 'src', 'i18n', 'en')
const keys = new Set()
for (const file of listFiles(dictDir)) {
  const visit = (node) => {
    if (ts.isPropertyAssignment(node) && (ts.isStringLiteral(node.name) || ts.isIdentifier(node.name))) keys.add(collapse(node.name.text))
    ts.forEachChild(node, visit)
  }
  visit(parse(file))
}

const sourceFiles = (paths.length ? paths.map((p) => join(root, p)) : [join(root, 'src')])
  .flatMap((p) => (statSync(p).isDirectory() ? listFiles(p) : [p]))
  .filter((f) => !f.startsWith(join(root, 'src', 'i18n')))

const literalText = (node) => (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) ? node.text : null)
let missing = 0
let unwrapped = 0

for (const file of sourceFiles) {
  const sf = parse(file)
  const rel = relative(root, file).replace(/\\/g, '/')
  const at = (node) => `${rel}:${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`
  const insideTranslate = new Set()

  const visit = (node) => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && (node.expression.text === 't' || node.expression.text === 'tx')) {
      const isTx = node.expression.text === 'tx'
      const textArg = node.arguments[isTx ? 1 : 0]
      const text = textArg && literalText(textArg)
      if (text !== null && text !== undefined) {
        insideTranslate.add(textArg)
        const context = isTx ? literalText(node.arguments[0]) : null
        const ok = keys.has(collapse(text)) || (context !== null && keys.has(collapse(`${context}|${text}`)))
        if (!ok && VI.test(text)) {
          missing++
          console.log(`MISSING ${at(node)}  ${collapse(text)}`)
        }
      }
    }
    if (showUnwrapped) {
      const text = ts.isJsxText(node) ? node.getText(sf) : literalText(node)
      if (text && VI.test(text) && !insideTranslate.has(node) && !ts.isImportDeclaration(node.parent)) {
        unwrapped++
        console.log(`UNWRAPPED ${at(node)}  ${collapse(text).slice(0, 120)}`)
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
}

console.log(`${keys.size} EN keys; ${missing} missing${showUnwrapped ? `; ${unwrapped} unwrapped Vietnamese strings` : ''}`)
process.exit(missing ? 1 : 0)

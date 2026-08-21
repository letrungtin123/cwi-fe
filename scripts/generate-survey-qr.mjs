import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import QRCode from 'qrcode'

const surveyUrl = process.env.SURVEY_QR_URL ?? 'https://ceo-workforce-index.com/survey?entry=qr'
const publicDirectory = resolve('public')
const svgPath = resolve(publicDirectory, 'ceo-workforce-survey-qr.svg')
const pngPath = resolve(publicDirectory, 'ceo-workforce-survey-qr.png')
const options = {
  errorCorrectionLevel: 'H',
  margin: 4,
  width: 1024,
  color: {
    dark: '#06245c',
    light: '#ffffff',
  },
}

await mkdir(publicDirectory, { recursive: true })

const svg = await QRCode.toString(surveyUrl, { ...options, type: 'svg' })
const png = await QRCode.toBuffer(surveyUrl, { ...options, type: 'png' })

await writeFile(svgPath, svg, 'utf8')
await writeFile(pngPath, png)
console.log(`Generated ${svgPath} and ${pngPath} for ${surveyUrl}`)

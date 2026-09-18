import { mkdirSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const root = join(dirname(fileURLToPath(import.meta.url)), "..")
const dir = join(root, "public/products")
mkdirSync(dir, { recursive: true })
mkdirSync(join(root, "public/categories"), { recursive: true })

function frame(inner, sku) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
  <rect width="800" height="800" fill="#FFF9E8"/>
  <circle cx="640" cy="120" r="180" fill="#FFFFFF" opacity="0.7"/>
  <circle cx="80" cy="680" r="140" fill="#FFC928" opacity="0.12"/>
  ${inner}
  <rect x="0" y="668" width="800" height="132" fill="#FFFFFF" opacity="0.92"/>
  <text x="400" y="716" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" letter-spacing="4" fill="#737373">PRODUCT IMAGE</text>
  <text x="400" y="754" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="#171717">SKU: ${sku}</text>
</svg>`
}

const rack = (tiers) => {
  const start = 150
  const gap = 360 / (tiers - 1)
  const shelves = Array.from({ length: tiers }, (_, i) => {
    const y = start + i * gap
    return `<rect x="210" y="${y}" width="380" height="22" rx="4" fill="#FFC928"/>
      <rect x="222" y="${y + 22}" width="356" height="8" fill="#F5B900"/>`
  }).join("\n")
  return `
    <rect x="236" y="140" width="18" height="430" rx="4" fill="#171717"/>
    <rect x="546" y="140" width="18" height="430" rx="4" fill="#171717"/>
    ${shelves}
  `
}

const box = (w, h) => `
  <path d="M400 ${220 - h / 8} L${400 + w / 2} ${280} L400 ${340 + h / 10} L${400 - w / 2} ${280} Z" fill="#FFC928"/>
  <path d="M${400 - w / 2} 280 L${400 - w / 2} ${280 + h} L400 ${340 + h / 10 + h} L400 ${340 + h / 10} Z" fill="#F5B900"/>
  <path d="M${400 + w / 2} 280 L${400 + w / 2} ${280 + h} L400 ${340 + h / 10 + h} L400 ${340 + h / 10} Z" fill="#E0A800"/>
  <path d="M${400 - w / 2} 280 L400 ${340 + h / 10} L${400 + w / 2} 280" fill="none" stroke="#171717" stroke-width="4"/>
`

const hamper = (w, h) => `
  <rect x="${400 - w / 2}" y="${230}" width="${w}" height="${h}" rx="${w / 5}" fill="#F3F0E8" stroke="#171717" stroke-width="6"/>
  <rect x="${400 - w / 2 + 28}" y="${258}" width="${w - 56}" height="${h - 56}" rx="${w / 6}" fill="#FFFFFF" opacity="0.55"/>
  <circle cx="400" cy="${230 + h * 0.32}" r="10" fill="#171717" opacity="0.15"/>
  <circle cx="400" cy="${230 + h * 0.5}" r="10" fill="#171717" opacity="0.15"/>
  <circle cx="400" cy="${230 + h * 0.68}" r="10" fill="#171717" opacity="0.15"/>
`

const basket = (w, h) => `
  <path d="M${400 - w / 3} 250 C${400 - w / 3} 200, ${400 + w / 3} 200, ${400 + w / 3} 250" fill="none" stroke="#171717" stroke-width="16" stroke-linecap="round"/>
  <rect x="${400 - w / 2}" y="250" width="${w}" height="${h}" rx="28" fill="#93C5FD"/>
  <rect x="${400 - w / 2 + 24}" y="274" width="${w - 48}" height="${h - 48}" rx="18" fill="#FFFFFF" opacity="0.28"/>
`

const files = {
  "CJ-012": rack(4),
  "CJ-013": rack(5),
  "CJ-022": rack(3),
  "CJ-023": rack(5),
  B11: box(260, 160),
  A11: box(340, 200),
  A02: hamper(220, 340),
  B02: hamper(200, 300),
  9006: basket(420, 200),
  9007: basket(360, 280),
}

for (const [sku, inner] of Object.entries(files)) {
  writeFileSync(join(dir, `${sku}.svg`), frame(inner, sku))
}

writeFileSync(
  join(dir, "placeholder.svg"),
  frame(
    `<rect x="250" y="220" width="300" height="300" rx="28" fill="#FFC928"/>
     <text x="400" y="390" text-anchor="middle" font-size="42" font-weight="700" fill="#171717">IMG</text>`,
    "XXXXX",
  ),
)

console.log("Wrote product placeholders")

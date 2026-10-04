// Each bilateral feature is drawn once and reflected about its anatomical axis.
const reflect = (art: string) => `${art}<g transform="scale(-1 1)">${art}</g>`
const ribs = Array.from({ length: 4 }, (_, i) => {
  const y = 15 + i * 20
  const width = [37, 47, 44, 33][i]
  return `<path d="M-5 ${y} C-${width * .55} ${y + 7}-${width} ${y - 9}-${width} ${y + 1} C-${width} ${y + 12}-${width * .5} ${y + 21}-6 ${y + 9}"/>`
}).join('')

export const definitions = `<defs>
  <g id="bone"><path d="M-6 8 C-9 3-13 5-13-2 C-13-9-5-11 0-7 C5-11 13-9 13-2 C13 5 9 3 6 8 C3 26 3 52 6 70 C9 75 13 73 13 80 C13 87 5 89 0 85 C-5 89-13 87-13 80 C-13 73-9 75-6 70 C-3 52-3 26-6 8Z"/></g>

  <g id="hand">
    <path d="M-8 0 Q0-4 8 0 L9 12 Q0 17-9 12Z"/>
    <g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round">
      <path d="M-8 15 L-17 23 L-22 31 M-6 18 L-9 32 L-10 43 M0 19 L0 35 L0 48 M6 18 L8 33 L9 45 M11 17 L15 29 L16 39"/>
    </g><path class="detail" stroke-width="2" d="M-13 26 L-18 24 M-12 33 L-6 34 M-3 35 H3 M5 34 L11 33 M12 30 L18 28"/>
  </g>
  <g id="foot"><path d="M-7-4 Q0-8 7-4 L9 7 Q13 15 25 18 Q34 23 29 29 Q25 33 17 29 L-9 21 Q-15 17-11 8Z"/><path class="detail" stroke-width="2" d="M-4 4 L5 7 M-8 13 L10 18 M14 17 L10 26 M20 20 L17 29 M26 22 L24 31"/></g>
  <g id="ribs">${ribs}</g>
</defs>`

export const skull = `<path d="M0-66 C-27-66-43-47-43-23 L-41-6 Q-46 6-33 12 L-25 14 L-23 29 Q0 37 23 29 L25 14 L33 12 Q46 6 41-6 L43-23 C43-47 27-66 0-66Z"/>
${reflect('<path class="ink" d="M-34-19 Q-26-27-12-20 L-9-9 Q-12 3-25 2 Q-37 1-34-19Z"/>')}
<path class="ink" d="M0 0 C-3 4-10 15-7 19 Q-4 22 0 18 Q4 22 7 19 C10 15 3 4 0 0Z"/>
<path class="detail" stroke-width="2" d="M-16 25 V32 M-8 26 V34 M0 26 V34 M8 26 V34 M16 25 V32"/>`
export const jaw = `<path d="M-29-17 L-25-16 L-21-3 Q0 5 21-3 L25-16 L29-17 L27 3 Q24 15 0 16 Q-24 15-27 3Z"/><path class="detail" stroke-width="2" d="M-16-1 V5 M-8 1 V7 M0 2 V8 M8 1 V7 M16-1 V5"/>`
export const torso = `<path d="M-5-15 H5 V123 H-5Z"/>
<path class="detail" stroke-width="2" d="M-5-9 H5 M-5-3 H5 M-5 94 H5 M-5 103 H5 M-5 112 H5"/>
${reflect('<path d="M-5 4 C-19-5-29-3-45 2 Q-51 3-50 8 Q-49 12-44 10 C-28 4-19 4-6 12Z"/>')}
<g fill="none" stroke="#fff" stroke-width="7">${reflect('<use href="#ribs"/>')}</g>
<path d="M-6 6 Q0 2 6 6 L5 53 L2 67 L0 71 L-2 67 L-5 53Z"/>
${reflect('<path d="M-4 119 C-17 119-24 101-39 108 C-50 116-42 137-32 141 L-25 156 Q-15 167-3 157 L0 146 L-8 140 C-19 137-24 129-22 123 L-7 135Z"/><path class="ink" d="M-21 141 Q-10 141-8 150 Q-10 160-19 156 Q-27 152-21 141Z"/>')}
<path d="M-8 119 H8 L5 134 L0 142 L-5 134Z"/>`
export function limb(length: number, end?: 'hand' | 'foot', mirror = false) {
  return `<use href="#bone" transform="scale(0.9 ${length / 78})"/>${end ? `<use href="#${end}" transform="translate(0 ${length + 5}) scale(${mirror ? -0.8 : 0.8} 0.8)"/>` : ''}`
}

const bulbColors = ['#ff665e', '#ffd66b', '#7edca1', '#8dbfff']
const bulbs = [
  ...Array.from({ length: 7 }, (_, i) => [-84 + i * 28, -70]),
  ...Array.from({ length: 7 }, (_, i) => [-84 + i * 28, 70]),
  [-102, -42], [-102, -14], [-102, 14], [-102, 42],
  [102, -42], [102, -14], [102, 14], [102, 42],
].map(([x, y], i) => `<g transform="translate(${x} ${y})"><circle r="7" fill="${bulbColors[i % 4]}" opacity=".18" stroke="none"/><circle r="4" fill="${bulbColors[i % 4]}" stroke="none"/><circle cx="-1" cy="-1" r="1.2" fill="#fff" stroke="none" opacity=".8"/></g>`).join('')
export const birthdaySign = `<rect x="-105" y="-73" width="210" height="146" rx="18" fill="#161d19" stroke="#000" stroke-width="5"/>
<rect x="-94" y="-62" width="188" height="124" rx="12" fill="#fff4d7" stroke="#e2cfa8" stroke-width="2"/>
<rect x="-102" y="-70" width="204" height="140" rx="16" fill="none" stroke="#46654d" stroke-width="2"/>
${bulbs}
<g fill="#28251f" stroke="none" text-anchor="middle" font-family="ui-rounded, 'Arial Rounded MT Bold', 'Trebuchet MS', sans-serif" font-weight="700">
<text y="-29" font-size="22">thanks for</text><text y="1" font-size="22">coming to my</text><text y="36" font-size="29">birthday</text>
</g>`

// All artwork uses local coordinates measured in SVG units.
export const definitions = `<defs>
  <g id="bone"><path d="M-8 8 C-20 1-20-12-10-14 Q0-20 10-14 C20-12 20 1 8 8 L8 64 C20 72 17 86 7 85 Q0 91-7 85 C-17 86-20 72-8 64Z"/></g>
  <g id="hand"><path d="M-11 0 L-17 19 Q-22 27-16 29 L-9 24 L-8 39 Q-5 48 0 40 Q6 48 10 39 Q18 42 19 33 L17 11 Q15 1 8 0Z"/><path class="detail" d="M0 22 1 38 M9 21 10 37"/></g>
  <g id="foot"><path d="M-10-5 Q0-10 10-5 L13 13 Q37 20 34 32 Q30 42 13 37 L-11 28 Q-20 22-13 9Z"/><path class="detail" d="M20 23 17 34 M28 26 25 36"/></g>
</defs>`

export const skull = `<path d="M-49 3 C-57-25-39-62-8-66 C28-73 57-46 55-10 Q55 18 32 25 L20 25 L16 38 L6 34 L0 40 L-8 33 L-17 37 L-22 25 L-37 23 Q-55 21-49 3Z"/>
<path class="ink" d="M-30-18 C-44-12-39 10-26 9 C-11 8-13-18-25-19Z M18-17 C3-16 4 10 19 12 C34 13 37-11 24-16Z M-4 15 Q-13 16-5 29 Q0 33 6 21 Q8 15-4 15Z"/>`
export const jaw = `<path d="M-29-6 Q0 11 29-6 L25 9 Q0 28-25 9Z"/>`
export const torso = `<path class="detail" stroke-width="13" d="M0 0 L0 122"/>
<path d="M-6 8 Q-25 11-44-1 Q-57 8-45 19 Q-29 31-8 25 M6 8 Q25 11 44-1 Q57 8 45 19 Q29 31 8 25
M-8 34 Q-33 37-49 23 Q-60 36-44 47 Q-25 56-8 49 M8 34 Q33 37 49 23 Q60 36 44 47 Q25 56 8 49
M-8 58 Q-31 62-49 49 Q-59 65-43 74 Q-22 86-8 73 M8 58 Q31 62 49 49 Q59 65 43 74 Q22 86 8 73
M-8 83 Q-29 91-43 78 Q-51 95-32 102 Q-19 105-5 90 M8 83 Q29 91 43 78 Q51 95 32 102 Q19 105 5 90"/>
<path d="M-7 3 Q0-3 7 3 L8 72 Q6 91 0 93 Q-9 87-8 73Z"/>
<path d="M0 125 C-36 82-62 123-37 150 Q-21 174 0 154 Q21 174 37 150 C62 123 36 82 0 125Z"/>
<path class="ink" d="M-29 128 Q-15 121-13 140 Q-18 151-27 140Z M29 128 Q15 121 13 140 Q18 151 27 140Z"/>`
export function limb(length: number, end?: 'hand' | 'foot', mirror = false) {
  return `<use href="#bone" transform="scale(0.72 ${length / 78})"/>${end ? `<use href="#${end}" transform="translate(0 ${length + 5}) scale(${mirror ? -0.8 : 0.8} 0.8)"/>` : ''}`
}

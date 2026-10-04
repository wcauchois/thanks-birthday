// Mirrored curves and shared silhouettes keep the SVG small and symmetric.
export const definitions = `<defs>
  <g id="bone"><path d="M-7 9 C-9 3-16 4-16-4 C-16-13-7-16 0-10 C7-16 16-13 16-4 C16 4 9 3 7 9 C4 24 4 54 7 69 C9 75 16 74 16 82 C16 91 7 94 0 88 C-7 94-16 91-16 82 C-16 74-9 75-7 69 C-4 54-4 24-7 9Z"/></g>
  <g id="hand"><path d="M-10 0 Q0-4 10 0 L12 15 L20 25 Q23 30 19 32 Q16 33 11 27 L11 40 Q11 45 7 45 Q3 45 3 40 L3 25 L3 45 Q3 49-1 49 Q-5 49-5 45 L-5 25 L-5 40 Q-5 44-9 44 Q-13 44-13 40 L-14 18Z"/></g>
  <g id="foot"><path d="M-9-4 Q0-8 9-4 L10 11 C12 18 33 16 35 26 C38 38 24 40 13 36 L-9 29 Q-17 26-14 15Z"/><path class="detail" d="M20 25 L18 35 M28 27 L26 37"/></g>
  <g id="ribs"><path d="M-5 8 C-19 9-32 6-43 0 C-52-5-56 5-49 12 C-37 24-20 27-5 22Z M-6 32 C-21 36-39 31-49 23 C-58 34-48 44-37 48 C-25 53-14 51-6 47Z M-6 57 C-21 63-39 56-49 50 C-56 61-48 71-36 75 C-23 79-12 75-6 70Z M-6 81 C-18 91-33 85-43 78 C-48 89-39 99-29 100 C-18 101-9 95-4 89Z"/></g>
</defs>`

export const skull = `<path d="M0-66 C-32-66-52-42-52-13 C-52 9-43 22-27 24 L-22 24 L-20 34 Q-18 39-13 35 L-10 31 L-6 37 Q0 42 6 37 L10 31 L13 35 Q18 39 20 34 L22 24 L27 24 C43 22 52 9 52-13 C52-42 32-66 0-66Z"/>
<path class="ink" d="M-33-15 C-23-24-10-17-11-4 C-12 9-28 13-34 3 C-38-3-38-10-33-15Z M33-15 C23-24 10-17 11-4 C12 9 28 13 34 3 C38-3 38-10 33-15Z M0 11 C-4 11-10 21-7 25 Q-4 29 0 25 Q4 29 7 25 C10 21 4 11 0 11Z"/>`
export const jaw = `<path d="M-28-4 C-21 1-14 5 0 5 C14 5 21 1 28-4 L25 9 C19 20-19 20-25 9Z"/>`
export const torso = `<path d="M-6 85 L6 85 L6 124 L-6 124Z"/><path class="detail" d="M-6 103 H6 M-6 114 H6"/>
<use href="#ribs"/><use href="#ribs" transform="scale(-1 1)"/>
<path d="M-6 2 Q0-3 6 2 C10 18 8 52 6 74 Q4 88 0 92 Q-4 88-6 74 C-8 52-10 18-6 2Z"/>
<path d="M0 125 C-14 106-32 104-42 117 C-54 134-39 151-24 158 Q-13 164 0 153 Q13 164 24 158 C39 151 54 134 42 117 C32 104 14 106 0 125Z"/>
<path class="ink" d="M-30 126 C-20 121-12 133-16 142 C-22 150-37 132-30 126Z M30 126 C20 121 12 133 16 142 C22 150 37 132 30 126Z"/>`
export function limb(length: number, end?: 'hand' | 'foot', mirror = false) {
  return `<use href="#bone" transform="scale(0.72 ${length / 78})"/>${end ? `<use href="#${end}" transform="translate(0 ${length + 5}) scale(${mirror ? -0.8 : 0.8} 0.8)"/>` : ''}`
}

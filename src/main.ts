import '@fontsource/grandstander/latin-600.css'
import './style.css'
import { definitions } from './art'
import { createSkeleton, WIDTH, HEIGHT } from './physics'
import { setupMotion } from './motion'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <svg class="stage" viewBox="160 85 280 560" aria-label="Skeleton holding a Christmas-lit sign that says thanks for coming to my birthday. Drag a bone to move it. Tap to enable phone motion. Press R to reset." role="img" tabindex="0">
    ${definitions}
    <g id="skeleton"></g>
  </svg>
  <p id="status" class="visually-hidden" role="status"></p><div id="engage" class="engage">
    <div class="engage-card"><p id="engage-message" role="status" hidden></p>
    <button id="motion" aria-pressed="false" disabled>tap to engage</button>
    <p id="engage-help" hidden></p></div>
  </div><div class="visually-hidden"><button id="reset" disabled>Reset</button></div>`

const svg = app.querySelector<SVGSVGElement>('.stage')!
const status = app.querySelector<HTMLElement>('#status')!
const motionButton = app.querySelector<HTMLButtonElement>('#motion')!
const resetButton = app.querySelector<HTMLButtonElement>('#reset')!
const resize = () => {
  const aspect = window.innerWidth / window.innerHeight
  const height = Math.max(1150, 650 / aspect) * 0.7
  const width = height * aspect
  svg.setAttribute('viewBox', `${400 - width / 2} ${285 - height / 2} ${width} ${height}`)
}
resize()
window.addEventListener('resize', resize)

try {
  const skeleton = await createSkeleton(app.querySelector<SVGGElement>('#skeleton')!)
  skeleton.render()
  motionButton.disabled = resetButton.disabled = false
  status.textContent = 'Grab a bone. Let it go.'
  const engage = app.querySelector<HTMLElement>('#engage')!
  const message = app.querySelector<HTMLElement>('#engage-message')!
  const help = app.querySelector<HTMLElement>('#engage-help')!
  const motion = setupMotion(motionButton, status, skeleton.gravity, skeleton.kick,
    () => { engage.hidden = true },
    (text, guidance) => {
      engage.hidden = false
      engage.classList.add('engage-error')
      message.hidden = help.hidden = false
      message.textContent = text
      help.textContent = guidance
      motionButton.textContent = 'try again'
      status.classList.remove('motion-feedback')
    })
  let pointer: number | undefined
  const position = (event: PointerEvent) => {
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM()!.inverse())
    return { x: Math.max(15, Math.min(WIDTH - 15, p.x)), y: Math.max(15, Math.min(HEIGHT - 15, p.y)) }
  }
  const requestMotion = () => { void motion.enable() }
  svg.addEventListener('keydown', event => {
    if (event.key.toLowerCase() === 'r') resetButton.click()
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); requestMotion() }
  })
  svg.addEventListener('pointerdown', event => {
    if (pointer !== undefined) return
    const target = (event.target as Element).closest<SVGGElement>('[data-part]')
    if (!target) return
    event.preventDefault()
    pointer = event.pointerId
    svg.setPointerCapture(pointer)
    const p = position(event)
    skeleton.drag(target.dataset.part!, p.x, p.y)
    svg.classList.add('dragging')
  })
  svg.addEventListener('pointermove', event => {
    if (event.pointerId !== pointer) return
    const p = position(event)
    skeleton.move(p.x, p.y)
  })
  const release = () => {
    skeleton.release()
    if (pointer !== undefined && svg.hasPointerCapture(pointer)) svg.releasePointerCapture(pointer)
    pointer = undefined
    svg.classList.remove('dragging')
  }
  svg.addEventListener('pointerup', release)
  svg.addEventListener('pointercancel', release)
  svg.addEventListener('lostpointercapture', release)
  window.addEventListener('blur', release)
  resetButton.addEventListener('click', () => { release(); skeleton.reset(); skeleton.render() })
  let previous = performance.now(), accumulator = 0, frame = 0
  function animate(now: number) {
    accumulator += Math.min((now - previous) / 1000, 0.05)
    previous = now
    while (accumulator >= 1 / 60) { skeleton.step(); accumulator -= 1 / 60 }
    skeleton.render()
    frame = requestAnimationFrame(animate)
  }
  frame = requestAnimationFrame(animate)
  const visibility = () => { release(); previous = performance.now(); accumulator = 0 }
  document.addEventListener('visibilitychange', visibility)
  import.meta.hot?.dispose(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('resize', resize)
    window.removeEventListener('blur', release)
    document.removeEventListener('visibilitychange', visibility)
    motion.dispose()
    skeleton.dispose()
  })
} catch (error) {
  status.textContent = 'The bones couldn’t wake up. Please reload to try again.'
  console.error(error)
}

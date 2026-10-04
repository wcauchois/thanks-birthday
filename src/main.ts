import './style.css'
import { definitions } from './art'
import { createSkeleton, WIDTH, HEIGHT } from './physics'
import { setupMotion } from './motion'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <header><a class="wordmark" href="./" aria-label="Loose bones home">loose bones</a><span class="edition">A LITTLE LIFE IN THE AFTERLIFE</span></header>
  <main>
    <div class="intro"><p class="eyebrow">NOTHING TO DO. JUST RATTLE.</p><h1>Hang loose.</h1></div>
    <svg class="stage" viewBox="0 0 ${WIDTH} ${HEIGHT}" aria-label="A cartoon skeleton hanging by its skull. Drag any bone to make it dance." role="img">
      ${definitions}
      <path class="thread" d="M300 0 V112"/><circle class="pin" cx="300" cy="112" r="4"/>
      <g id="skeleton"></g>
    </svg>
    <div class="controls"><p id="status" role="status">Waking the bones…</p><div class="buttons"><button id="motion" aria-pressed="false" disabled><span>Enable motion</span></button><button id="reset" class="secondary" disabled>Reset <span aria-hidden="true">↺</span></button></div></div>
  </main>
  <footer><span>ALL BONES. NO WORRIES.</span><span>DRAG · TILT · RATTLE</span></footer>`

const svg = app.querySelector<SVGSVGElement>('.stage')!
const status = app.querySelector<HTMLElement>('#status')!
const motionButton = app.querySelector<HTMLButtonElement>('#motion')!
const resetButton = app.querySelector<HTMLButtonElement>('#reset')!

try {
  const skeleton = await createSkeleton(app.querySelector<SVGGElement>('#skeleton')!)
  skeleton.render()
  motionButton.disabled = resetButton.disabled = false
  status.textContent = 'Grab a bone. Let it go.'
  const cleanupMotion = setupMotion(motionButton, status, skeleton.gravity, skeleton.kick)
  let pointer: number | undefined
  const position = (event: PointerEvent) => {
    const p = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM()!.inverse())
    return { x: Math.max(15, Math.min(WIDTH - 15, p.x)), y: Math.max(15, Math.min(HEIGHT - 15, p.y)) }
  }
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
    window.removeEventListener('blur', release)
    document.removeEventListener('visibilitychange', visibility)
    cleanupMotion()
    skeleton.dispose()
  })
} catch (error) {
  status.textContent = 'The bones couldn’t wake up. Please reload to try again.'
  console.error(error)
}

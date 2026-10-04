type MotionConstructor = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

export function setupMotion(button: HTMLButtonElement, status: HTMLElement, gravity: (x: number, y: number) => void, kick: (x: number, y: number) => void) {
  let active = false
  let pending = false
  let disposed = false
  let gx = 0, gy = 9.81, lastKick = 0
  let timeout: ReturnType<typeof setTimeout> | undefined
  let received = false
  function onMotion(event: DeviceMotionEvent) {
    const g = event.accelerationIncludingGravity
    if (g?.x == null || g.y == null) return
    received = true
    clearTimeout(timeout)
    const angle = (screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0) * Math.PI / 180
    const rotate = (x: number, y: number) => ({ x: x * Math.cos(angle) + y * Math.sin(angle), y: -x * Math.sin(angle) + y * Math.cos(angle) })
    const tilt = rotate(-g.x, g.y)
    gx += (clamp(tilt.x, 16) - gx) * 0.12
    gy += (clamp(tilt.y, 16) - gy) * 0.12
    gravity(gx, gy)
    const a = event.acceleration
    const now = performance.now()
    if (a?.x != null && a.y != null && Math.hypot(a.x, a.y) > 5 && now - lastKick > 120) {
      const shake = rotate(-a.x, a.y)
      kick(clamp(shake.x * 0.035, 0.7), clamp(shake.y * 0.035, 0.7))
      lastKick = now
    }
    status.textContent = 'Tilt gently. Give it a little shake.'
    status.classList.remove('motion-feedback')
  }
  function stop() {
    active = false
    clearTimeout(timeout)
    window.removeEventListener('devicemotion', onMotion)
    button.textContent = 'Enable motion'
    button.setAttribute('aria-pressed', 'false')
    gravity(0, 9.81)
  }
  async function enable() {
    if (active || pending || disposed) return
    status.classList.add('motion-feedback')
    if (!window.isSecureContext || typeof DeviceMotionEvent === 'undefined') {
      status.textContent = !window.isSecureContext ? 'Motion needs HTTPS. You can still drag the bones.' : 'No motion sensor here. Try dragging a bone.'
      return
    }
    pending = true
    try {
      const api = DeviceMotionEvent as MotionConstructor
      if (api.requestPermission && await api.requestPermission() !== 'granted') {
        status.textContent = 'Motion permission declined. Allow motion in your browser’s site settings, then tap to retry.'
        return
      }
      if (disposed) return
      active = true
      received = false
      gx = 0; gy = 9.81
      window.addEventListener('devicemotion', onMotion)
      button.textContent = 'Motion on'
      button.setAttribute('aria-pressed', 'true')
      status.textContent = 'Waiting for your phone’s motion sensor…'
      timeout = setTimeout(() => {
        if (!received) { stop(); status.textContent = 'No motion data received. Check your browser’s motion access, then tap to retry.' }
      }, 4000)
    } catch {
      stop()
      status.textContent = 'Motion couldn’t start. Tap to retry, or open this page directly in Safari or Chrome.'
    } finally {
      pending = false
    }
  }
  function toggle() {
    if (active) { stop(); status.classList.remove('motion-feedback'); return }
    void enable()
  }
  button.addEventListener('click', toggle)
  return { enable, dispose() { disposed = true; stop(); button.removeEventListener('click', toggle) } }
}

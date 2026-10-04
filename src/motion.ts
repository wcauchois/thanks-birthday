type MotionConstructor = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

export function setupMotion(button: HTMLButtonElement, status: HTMLElement, gravity: (x: number, y: number) => void, kick: (x: number, y: number) => void) {
  let active = false
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
  }
  function stop() {
    active = false
    clearTimeout(timeout)
    window.removeEventListener('devicemotion', onMotion)
    button.textContent = 'Enable motion'
    button.setAttribute('aria-pressed', 'false')
    gravity(0, 9.81)
  }
  async function toggle() {
    if (active) { stop(); status.textContent = 'Grab a bone. Let it go.'; return }
    if (!window.isSecureContext || typeof DeviceMotionEvent === 'undefined') {
      status.textContent = !window.isSecureContext ? 'Motion needs HTTPS. You can still drag the bones.' : 'No motion sensor here. Try dragging a bone.'
      return
    }
    try {
      const api = DeviceMotionEvent as MotionConstructor
      if (api.requestPermission && await api.requestPermission() !== 'granted') {
        status.textContent = 'Motion permission declined. You can still drag the bones.'
        return
      }
      active = true
      received = false
      gx = 0; gy = 9.81
      window.addEventListener('devicemotion', onMotion)
      button.textContent = 'Motion on'
      button.setAttribute('aria-pressed', 'true')
      status.textContent = 'Waiting for your phone’s motion sensor…'
      timeout = setTimeout(() => {
        if (!received) { stop(); status.textContent = 'No motion data received. Try dragging a bone.' }
      }, 4000)
    } catch {
      stop()
      status.textContent = 'Motion couldn’t start. You can still drag the bones.'
    }
  }
  button.addEventListener('click', toggle)
  return () => { stop(); button.removeEventListener('click', toggle) }
}

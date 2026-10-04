type MotionConstructor = typeof DeviceMotionEvent & { requestPermission?: () => Promise<string> }
const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value))

export function setupMotion(button: HTMLButtonElement, status: HTMLElement, gravity: (x: number, y: number) => void, kick: (x: number, y: number) => void, onReady: () => void, onIssue: (message: string, help: string) => void = () => {}) {
  let active = false
  let pending = false
  let disposed = false
  let gx = 0, gy = 9.81
  let timeout: ReturnType<typeof setTimeout> | undefined
  let received = false
  let baseline = 0, samples = 0, calibrationStart = 0
  let orientation: number | undefined
  let previousTime = 0
  let filteredX = 0
  let slow = { x: 0, y: 0, z: 0 }
  let ready = false
  let denials = 0
  function fail(message: string, help: string) {
    stop()
    status.textContent = message
    onIssue(message, help)
  }
  function onMotion(event: DeviceMotionEvent) {
    const g = event.accelerationIncludingGravity
    if (g?.x == null || g.y == null) return
    received = true
    clearTimeout(timeout)
    const degrees = screen.orientation?.angle ?? (window as Window & { orientation?: number }).orientation ?? 0
    const angle = degrees * Math.PI / 180
    const rotate = (x: number, y: number) => ({ x: x * Math.cos(angle) + y * Math.sin(angle), y: -x * Math.sin(angle) + y * Math.cos(angle) })
    const now = performance.now()
    const tilt = rotate(-g.x, g.y)
    if (orientation !== degrees) {
      orientation = degrees
      samples = 0
      baseline = 0
      calibrationStart = now
      previousTime = now
      filteredX = tilt.x
      slow = { x: g.x, y: g.y, z: g.z ?? 0 }
    }
    // Calibrate the comfortable holding angle, not a phone lying flat.
    // Keep downward gravity stable: pitching the phone must not lift the puppet.
    if (now - calibrationStart < 500 || samples < 5) {
      baseline += (tilt.x - baseline) / ++samples
      slow = { x: g.x, y: g.y, z: g.z ?? 0 }
      previousTime = now
      status.textContent = 'Hold still for a moment…'
      gravity(0, 9.81)
      return
    }
    const dt = Math.max(0, Math.min((now - previousTime) / 1000, 0.05))
    previousTime = now
    const a = event.acceleration
    const hasLinear = a?.x != null && a.y != null && Number.isFinite(a.x) && Number.isFinite(a.y)
    const alpha = 1 - Math.exp(-dt / 0.35)
    slow.x += (g.x - slow.x) * alpha
    slow.y += (g.y - slow.y) * alpha
    slow.z += ((g.z ?? 0) - slow.z) * alpha
    const ax = hasLinear ? a.x! : g.x - slow.x
    const ay = hasLinear ? a.y! : g.y - slow.y
    const az = hasLinear ? (a.z ?? 0) : (g.z ?? 0) - slow.z
    // Separate slow tilt from translation so a shake does not steer gravity.
    const tiltOnly = hasLinear ? rotate(-(g.x - ax), g.y - ay) : rotate(-slow.x, slow.y)
    filteredX += (tiltOnly.x - filteredX) * (1 - Math.exp(-dt / 0.18))
    const lean = filteredX - baseline
    const target = Math.abs(lean) < 0.25 ? 0 : clamp((lean - Math.sign(lean) * 0.25) * 1.4, 8)
    gx = target
    gy = 9.81
    gravity(gx, gy)
    if (!ready) { ready = true; onReady() }
    // In the phone's frame, the puppet lags opposite its acceleration.
    // Integrating acceleration over sensor time makes response independent of Hz.
    const shake = rotate(-ax, ay)
    const deadZone = (v: number) => Math.sign(v) * Math.max(0, Math.abs(v) - 0.12)
    // Depth has no literal 2D axis; map a little of it vertically for face-on shakes.
    const sx = deadZone(shake.x) * 5
    const sy = deadZone(shake.y + az * 0.45) * 5
    const limit = Math.min(1, 65 / Math.max(1, Math.hypot(sx, sy)))
    if (dt > 0) kick(sx * limit * dt, sy * limit * dt)
    status.textContent = 'Tilt gently. Give it a little shake.'
    status.classList.remove('motion-feedback')
  }
  function stop() {
    active = false
    button.disabled = false
    clearTimeout(timeout)
    window.removeEventListener('devicemotion', onMotion)
    button.textContent = 'tap to engage'
    button.setAttribute('aria-pressed', 'false')
    gravity(0, 9.81)
  }
  async function enable() {
    if (active || pending || disposed) return
    status.classList.add('motion-feedback')
    if (!window.isSecureContext || typeof DeviceMotionEvent === 'undefined') {
      fail('motion isn’t available here', !window.isSecureContext ? 'Open the HTTPS version of this page to use motion.' : 'Open this page directly in a phone browser with motion support.')
      return
    }
    pending = true
    button.disabled = true
    try {
      const api = DeviceMotionEvent as MotionConstructor
      if (api.requestPermission && await api.requestPermission() !== 'granted') {
        denials++
        fail('motion access is needed to wake the skeleton', denials > 1
          ? 'Your browser is still denying access. Try again cannot override that choice. Reset motion permission in your browser or start a fresh browsing session, then return here.'
          : 'Tap try again and allow motion access. If no prompt appears, your browser may remember the denial; reset its permission or start a fresh browsing session.')
        return
      }
      if (disposed) return
      active = true
      received = false
      gx = 0; gy = 9.81
      orientation = undefined; ready = false
      window.addEventListener('devicemotion', onMotion)
      button.textContent = 'hold still…'
      button.setAttribute('aria-pressed', 'true')
      status.textContent = 'Waiting for your phone’s motion sensor…'
      timeout = setTimeout(() => {
        if (!received) fail('no motion detected yet', 'Check that motion access is allowed in your browser, then try again.')
      }, 4000)
    } catch {
      if (!disposed) fail('motion couldn’t start', 'Try again, or open this page directly in Safari or Chrome on your phone.')
    } finally {
      pending = false
      button.disabled = active
    }
  }
  function toggle() {
    if (active) { stop(); status.classList.remove('motion-feedback'); return }
    void enable()
  }
  button.addEventListener('click', toggle)
  return { enable, dispose() { disposed = true; stop(); button.removeEventListener('click', toggle) } }
}

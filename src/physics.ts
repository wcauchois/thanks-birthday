import RAPIER from '@dimforge/rapier2d-compat'
import { skull, jaw, torso, limb, birthdaySign } from './art'

const SCALE = 100
export const WIDTH = 600
export const HEIGHT = 780
export async function createSkeleton(layer: SVGGElement) {
  await RAPIER.init()
  const world = new RAPIER.World({ x: 0, y: 9.81 })
  world.timestep = 1 / 60
  const parts: { body: RAPIER.RigidBody; element: SVGGElement; x: number; y: number; angle: number }[] = []
  const point = (x: number, y: number) => ({ x: x / SCALE, y: y / SCALE })
  function part(name: string, x: number, y: number, art: string, halfWidth: number, halfHeight: number, cy = 0, angle = 0) {
    const body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setTranslation(x / SCALE, y / SCALE).setRotation(angle).setLinearDamping(0.35).setAngularDamping(0.55))
    // Disable collisions between skeleton pieces so joints swing freely.
    world.createCollider(RAPIER.ColliderDesc.cuboid(halfWidth / SCALE, halfHeight / SCALE).setTranslation(0, cy / SCALE).setCollisionGroups(0x00010002).setDensity(1), body)
    const element = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    element.innerHTML = art
    element.dataset.part = name
    element.classList.add('body-part')
    layer.append(element)
    parts.push({ body, element, x, y, angle })
    return body
  }
  function join(a: RAPIER.RigidBody, b: RAPIER.RigidBody, ax: number, ay: number, bx: number, by: number, limits?: [number, number]) {
    const joint = world.createImpulseJoint(RAPIER.JointData.revolute(point(ax, ay), point(bx, by)), a, b, true) as RAPIER.RevoluteImpulseJoint
    if (limits) joint.setLimits(...limits)
  }
  const anchor = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(3, 1.12))
  const head = part('skull', 300, 178, skull, 43, 45, -16)
  join(anchor, head, 0, 0, 0, -66, [-0.7, 0.7])
  const chest = part('torso', 300, 236, torso, 43, 77, 75)
  join(head, chest, 0, 48, 0, -10, [-0.65, 0.65])
  const chin = part('jaw', 300, 216, jaw, 24, 10, 4)
  join(head, chin, 0, 38, 0, 0, [-0.12, 0.12])
  // The sign supports the raised hand, leaving the rest of the ragdoll free.
  const sign = part('birthday-sign', 465, 10, `<g transform="scale(1.2)">${birthdaySign}</g>`, 120, 84)
  sign.setBodyType(RAPIER.RigidBodyType.Fixed, true)
  for (const side of [-1, 1]) {
    const shoulderX = 300 + side * 49
    let armAngle = -side * 0.28
    let forearmAngle = 0
    let elbowX = shoulderX - Math.sin(armAngle) * 85
    let elbowY = 242 + Math.cos(armAngle) * 85
    if (side === 1) {
      // Solve the two-link reach before stepping physics. Choose the elbow-out
      // solution so the hand starts on the sign, not hanging far below it.
      const dx = 465 - 78 - shoulderX, dy = 10 + 84 - 242
      const distance = Math.hypot(dx, dy)
      const along = (85 ** 2 - 105 ** 2 + distance ** 2) / (2 * distance)
      const across = Math.sqrt(85 ** 2 - along ** 2)
      elbowX = shoulderX + along * dx / distance - across * dy / distance
      elbowY = 242 + along * dy / distance + across * dx / distance
      armAngle = Math.atan2(-(elbowX - shoulderX), elbowY - 242)
      forearmAngle = Math.atan2(-(387 - elbowX), 94 - elbowY)
      if (forearmAngle > armAngle) forearmAngle -= Math.PI * 2
    }
    const arm = part(`arm-${side}`, shoulderX, 242, limb(85), 9, 43, 40, armAngle)
    join(chest, arm, side * 49, 6, 0, 0, [-2.6, 2.6])
    const forearm = part(`forearm-${side}`, elbowX, elbowY, limb(77, 'hand', side < 0), 12, 55, 49, forearmAngle)
    join(arm, forearm, 0, 85, 0, 0, side === 1 ? [-2.3, -0.08] : [-2.3, 2.3])
    if (side === 1) join(sign, forearm, -78, 84, 0, 105)
    const thigh = part(`thigh-${side}`, 300 + side * 24, 391, limb(101), 10, 50, 47, -side * 0.12)
    join(chest, thigh, side * 24, 155, 0, 0, [-1.3, 1.3])
    const shin = part(`shin-${side}`, 300 + side * 36, 491, limb(103, 'foot', side < 0), 12, 65, 57)
    join(thigh, shin, 0, 101, 0, 0, [-1.9, 1.9])
  }
  // Keep the lettering in front of the arm; fingers extend below the edge.
  const signElement = parts.find(p => p.body === sign)!.element
  signElement.style.pointerEvents = 'none'
  layer.append(signElement)
  const cursor = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased())
  let dragJoint: RAPIER.ImpulseJoint | undefined
  function release() {
    if (dragJoint) world.removeImpulseJoint(dragJoint, true)
    dragJoint = undefined
  }
  return {
    world,
    step() { world.step() },
    render() {
      for (const { body, element } of parts) {
        const p = body.translation()
        element.setAttribute('transform', `translate(${p.x * SCALE} ${p.y * SCALE}) rotate(${body.rotation() * 180 / Math.PI})`)
      }
    },
    drag(name: string, x: number, y: number) {
      release()
      const body = parts.find(p => p.element.dataset.part === name)?.body
      if (!body || body.isFixed()) return
      const p = body.translation(), a = body.rotation()
      const dx = x / SCALE - p.x, dy = y / SCALE - p.y
      cursor.setTranslation(point(x, y), true)
      cursor.setNextKinematicTranslation(point(x, y))
      dragJoint = world.createImpulseJoint(RAPIER.JointData.spring(0, 90, 9, { x: 0, y: 0 }, { x: dx * Math.cos(a) + dy * Math.sin(a), y: -dx * Math.sin(a) + dy * Math.cos(a) }), cursor, body, true)
    },
    move(x: number, y: number) { cursor.setNextKinematicTranslation(point(x, y)) },
    release,
    gravity(x: number, y: number) { world.gravity = { x, y }; for (const p of parts) p.body.wakeUp() },
    kick(x: number, y: number) { for (const { body } of parts) if (body.isDynamic()) body.applyImpulse({ x: x * body.mass(), y: y * body.mass() }, true) },
    reset() {
      release()
      for (const { body, x, y, angle } of parts) {
        body.setTranslation(point(x, y), true)
        body.setRotation(angle, true)
        body.setLinvel({ x: 0, y: 0 }, true)
        body.setAngvel(0, true)
      }
    },
    dispose() { world.free() },
  }
}

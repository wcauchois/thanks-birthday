import ts from 'typescript'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const code = ts.transpile(fs.readFileSync('src/motion.ts','utf8'), {module:ts.ModuleKind.ESNext})
const {setupMotion} = await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'))
let now=0, handler, value, ready=0
Object.defineProperty(globalThis,'performance',{value:{now:()=>now},configurable:true})
globalThis.screen={orientation:{angle:0}}
globalThis.window={isSecureContext:true,addEventListener:(n,f)=>{handler=f},removeEventListener:()=>{}}
globalThis.DeviceMotionEvent=class {static async requestPermission(){return 'granted'}}
const button={addEventListener(){},removeEventListener(){},setAttribute(){}}
const status={classList:{add(){},remove(){}}}
const m=setupMotion(button,status,(x,y)=>value={x,y},()=>{},()=>ready++)
await m.enable()
function emit(x,y){now+=20;handler({accelerationIncludingGravity:{x,y},acceleration:{x:0,y:0}})}
for(let i=0;i<50;i++)emit(2,8)
assert.equal(ready,1);assert.deepEqual(value,{x:0,y:9.81})
for(let i=0;i<50;i++)emit(4,8)
assert(value.x<0);assert.equal(value.y,9.81)
for(let i=0;i<100;i++)emit(2,5)
assert.deepEqual(value,{x:0,y:9.81})
screen.orientation.angle=90
for(let i=0;i<60;i++)emit(8,2)
assert.deepEqual(value,{x:0,y:9.81})
m.dispose()
console.log('PASS: neutral grip, sideways response, pitch stability, rotation recalibration')
let issue
DeviceMotionEvent.requestPermission = async () => 'denied'
const retry = setupMotion(button,status,()=>{},()=>{},()=>{},(message,help)=>issue={message,help})
await retry.enable()
assert.match(issue.message,/motion access is needed/)
assert.equal(button.disabled,false)
await retry.enable()
assert.match(issue.help,/still denying/)
DeviceMotionEvent.requestPermission = async () => 'granted'
await retry.enable()
for(let i=0;i<60;i++)emit(0,9.81)
assert.equal(button['textContent'],'hold still…')
retry.dispose()
console.log('PASS: denied permission, repeated denial guidance, successful retry')
async function shakeRun(hz, fallback = false) {
  screen.orientation.angle = 0
  const impulses = []
  const controller = setupMotion(button,status,()=>{},(x,y)=>impulses.push({x,y}),()=>{})
  await controller.enable()
  for(let i=0;i<hz;i++) {
    now += 1000/hz
    handler({accelerationIncludingGravity:{x:0,y:9.81,z:0},acceleration: fallback ? null : {x:0,y:0,z:0}})
  }
  impulses.length = 0
  for(let i=0;i<hz;i++) {
    const x = i < hz/2 ? 8 : -8
    now += 1000/hz
    handler({accelerationIncludingGravity:{x,y:9.81,z:0},acceleration:fallback ? null : {x,y:0,z:0}})
  }
  assert(impulses.some(v=>v.x<0) && impulses.some(v=>v.x>0), 'both shake directions must respond')
  assert(impulses.every(v=>Math.hypot(v.x,v.y)<=65/hz+1e-6), 'impulses stay bounded')
  controller.dispose()
  return impulses.reduce((sum,v)=>sum+Math.abs(v.x),0)
}
const shake30=await shakeRun(30), shake120=await shakeRun(120)
assert(Math.abs(shake30-shake120)<0.01, 'equivalent response at 30 and 120 Hz')
assert(await shakeRun(60,true)>5,'raw accelerometer fallback drives shaking')
console.log('PASS: bidirectional shake, impulse bounds, sensor-rate independence, missing-linear-acceleration fallback')

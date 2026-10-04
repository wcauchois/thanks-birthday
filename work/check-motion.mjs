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

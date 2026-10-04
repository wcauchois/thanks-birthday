import ts from 'typescript'
import fs from 'node:fs'
import assert from 'node:assert/strict'
const art = ts.transpile(fs.readFileSync('src/art.ts', 'utf8'), {module:ts.ModuleKind.ESNext})
const physics = ts.transpile(fs.readFileSync('src/physics.ts', 'utf8'), {module:ts.ModuleKind.ESNext}).replace("'./art'", JSON.stringify('data:text/javascript;base64,' + Buffer.from(art).toString('base64')))
fs.writeFileSync('work/physics.mjs', physics)
const nodes = []
globalThis.document = {createElementNS: () => ({dataset:{},classList:{add(){}},setAttribute(name,value){this[name]=value}})}
const {createSkeleton} = await import('./physics.mjs')
const s = await createSkeleton({append(node){nodes.push(node)}})
for(let i=0;i<1800;i++) s.step()
s.render()
assert(Math.abs(s.world.bodies.get(0).translation().x - 3) < 0.01)
for(const node of nodes) assert(!node.transform.includes('NaN'))
s.drag('shin-1',350,590)
s.move(500,200)
for(let i=0;i<120;i++) s.step()
s.release()
for(let i=0;i<600;i++) s.step()
s.render()
for(const node of nodes) assert(!node.transform.includes('NaN'))
s.reset();s.render()
const resetPosition = nodes[0].transform.match(/translate\(([^ ]+) ([^)]+)\)/)
assert(Math.abs(Number(resetPosition[1]) - 300) < 0.001)
assert(Math.abs(Number(resetPosition[2]) - 178) < 0.001)
assert(nodes.every(n => !n.transform.includes('NaN')))
s.dispose()
console.log('Stability, drag/release, and reset passed.')

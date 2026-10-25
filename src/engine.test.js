import {test} from 'node:test';import assert from 'node:assert/strict';import {RepEngine} from './engine.js';
const m=(elbow,hipOffset=0)=>({elbow,hipOffset,knee:180});
function frames(e,a,t){for(let i=0;i<3;i++)e.update(m(a),t+i*50);}
test('only full top-bottom-top cycle counts once',()=>{const e=new RepEngine();frames(e,170,0);frames(e,85,500);frames(e,170,1100);assert.equal(e.count,1);frames(e,170,1400);assert.equal(e.count,1);});
test('shallow reps rejected',()=>{const e=new RepEngine();frames(e,170,0);frames(e,120,500);frames(e,170,1100);assert.equal(e.count,0);assert.equal(e.rejected,1);});
test('bad form at any point invalidates the cycle',()=>{const e=new RepEngine();frames(e,170,0);e.update(m(120,-.1),400);frames(e,80,600);frames(e,170,1100);assert.equal(e.count,0);assert.equal(e.rejected,1);});
test('tracking loss requires a fresh top position',()=>{const e=new RepEngine();frames(e,170,0);frames(e,80,500);e.update(null,800);frames(e,170,1100);assert.equal(e.count,0);});
test('custom depth is respected',()=>{const e=new RepEngine(75);frames(e,170,0);frames(e,85,500);frames(e,170,1100);assert.equal(e.count,0);});

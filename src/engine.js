export const angle = (a,b,c) => {
 const u=[a.x-b.x,a.y-b.y],v=[c.x-b.x,c.y-b.y];
 return Math.acos(Math.max(-1,Math.min(1,(u[0]*v[0]+u[1]*v[1])/(Math.hypot(...u)*Math.hypot(...v)||1))))*180/Math.PI;
};
export function measure(points, aspect=1, side=null) {
 const ids=side ?? ([11,13,15,23,25,27].reduce((s,i)=>s+(points[i]?.visibility||0),0)>=[12,14,16,24,26,28].reduce((s,i)=>s+(points[i]?.visibility||0),0)?[11,13,15,23,25,27]:[12,14,16,24,26,28]);
 const p=ids.map(i=>points[i]);
 if(p.some(v=>!v||v.visibility<.65||v.x<.02||v.x>.98||v.y<.02||v.y>.98)) return null;
 const [s,e,w,h,k,a]=p.map(v=>({...v,x:v.x*aspect}));
 const span=Math.hypot(a.x-s.x,a.y-s.y);
 if(span<.25||Math.abs(a.x-s.x)<Math.abs(a.y-s.y)*1.5) return null;
 const t=((h.x-s.x)*(a.x-s.x)+(h.y-s.y)*(a.y-s.y))/(span*span);
 const hipOffset=(h.y-(s.y+t*(a.y-s.y)))/span;
 return {elbow:angle(s,e,w),hipOffset,knee:angle(h,k,a),ids};
}
export class RepEngine {
 constructor(depth=90){this.depth=depth;this.reset();}
 reset(){this.phase='ready';this.count=0;this.rejected=0;this.invalid=false;this.lowFrames=0;this.topFrames=0;this.started=0;this.last=0;}
 update(m,now){
  if(!m){this.phase='ready';this.lowFrames=0;this.topFrames=0;this.invalid=false;return {cue:'Keep your whole body in view',kind:'wait'};}
  let fault=m.knee<155?'Keep your knees off the floor':m.hipOffset<-.055?'Lower your hips':m.hipOffset>.055?'Lift your hips':null;
  const top=m.elbow>=160,low=m.elbow<=this.depth;
  if(this.phase==='ready'){
   this.topFrames=top&&!fault?this.topFrames+1:0;
   if(this.topFrames>=3){this.phase='top';this.invalid=false;}
   return {cue:fault|| (top?'Ready. Lower with control':'Straighten your arms to begin'),kind:fault?'warn':'good'};
  }
  if(this.phase==='top'&&m.elbow<145){this.phase='down';this.started=now;this.invalid=!!fault;}
  if(this.phase==='down'||this.phase==='bottom'){
   if(fault)this.invalid=true;
   this.lowFrames=low?this.lowFrames+1:0;
   if(this.lowFrames>=2)this.phase='bottom';
   this.topFrames=top?this.topFrames+1:0;
   if(this.topFrames>=3){
    const valid=this.phase==='bottom'&&!this.invalid&&now-this.started>=350&&now-this.last>=600;
    if(valid){this.count++;this.last=now;}else this.rejected++;
    this.phase='top';this.lowFrames=0;this.topFrames=0;
    return {cue:valid?'Good rep. Keep going':this.invalid?'No count — keep your body straight':'No count — go lower',kind:valid?'good':'warn',event:valid?'rep':'rejected'};
   }
  }
  return {cue:fault||(this.phase==='bottom'?'Depth reached. Push up':this.phase==='down'?'Go lower':'Lower with control'),kind:fault?'warn':this.phase==='bottom'?'good':'neutral'};
 }
}

/* Adapted from React Bits SpotlightCard. Copyright (c) 2026 David Haz.
 * MIT + Commons Clause; see react-bits-LICENSE.txt and THIRD-PARTY-NOTICES.md. */
(function(root){
'use strict';
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const falloff = (color, softness) => {
  const soft = clamp(softness, 0, 1);
  const core = (1 - soft) ** 1.5 * 0.85;
  const stop = (alpha, at) =>
    `color-mix(in srgb, ${color} ${(alpha * 100).toFixed(2)}%, transparent) ${(at * 100).toFixed(2)}%`;
  const list = [stop(1, 0)];
  for (let i = 0; i <= 14; i++) {
    const t = core + ((1 - core) * i) / 14;
    const g = (t - core) / (1 - core);
    const smooth = 1 - g * g * (3 - 2 * g);
    const glow = Math.exp(-4.6 * g * g) * (1 - g ** 6);
    list.push(stop(smooth + (glow - smooth) * soft, t));
  }
  return list.join(', ');
};

function mount(grid){
 const cards=[...grid.querySelectorAll('.spotlight-card')];
 const states=cards.map(card=>({card,light:card.querySelector('.spotlight-card__light'),edge:card.querySelector('.spotlight-card__edge'),x:0,y:0,presence:0}));
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const fill=falloff('rgb(50, 85, 164)',.85),edge=falloff('rgb(50, 85, 164)',1);
 let raf=0,last=0,alive=true,visible=false,pointer=null,focus=null;
 function render(now){
  raf=0;if(!alive||!visible||document.hidden)return;
  const dt=last?Math.min(.05,Math.max(.001,(now-last)/1000)):.016;last=now;
  let settling=false;
  for(const s of states){
   const box=s.card.getBoundingClientRect();let x=s.x,y=s.y,target=0;
   if(focus&&s.card.contains(focus)){const f=focus.getBoundingClientRect();x=f.left+f.width/2-box.left;y=f.top+f.height/2-box.top;target=1;}
   else if(pointer){x=pointer.x-box.left;y=pointer.y-box.top;const gap=Math.hypot(Math.max(0,-x,x-box.width),Math.max(0,-y,y-box.height));target=gap===0?1:Math.max(0,1-gap/85)**2;}
   if(s.presence<.02&&target>0){s.x=x;s.y=y;}
   const follow=media.matches?1:1-Math.exp(-dt/.075),fade=media.matches?1:1-Math.exp(-dt/(target>s.presence?.1:.26));
   s.x+=(x-s.x)*follow;s.y+=(y-s.y)*follow;s.presence+=(target-s.presence)*fade;
   if(Math.abs(target-s.presence)<.002)s.presence=target;
   const size=Math.min(360,Math.max(230,box.width*.78));
   s.light.style.background='radial-gradient(circle '+size+'px at '+s.x.toFixed(1)+'px '+s.y.toFixed(1)+'px, '+fill+')';
   s.edge.style.background='radial-gradient(circle '+(size*.8)+'px at '+s.x.toFixed(1)+'px '+s.y.toFixed(1)+'px, '+edge+')';
   s.light.style.opacity=String(s.presence*.12);s.edge.style.opacity=String(s.presence*.78);
   if(Math.abs(x-s.x)>.1||Math.abs(y-s.y)>.1||s.presence!==target)settling=true;
  }
  if(settling)raf=requestAnimationFrame(render);else last=0;
 }
 function wake(){if(alive&&visible&&!document.hidden&&!raf)raf=requestAnimationFrame(render);}
 function move(e){pointer={x:e.clientX,y:e.clientY};wake();}
 function leave(e){if(e.relatedTarget)return;pointer=null;wake();}
 function focusIn(e){if(e.target.matches&&e.target.matches(':focus-visible')){focus=e.target;wake();}}
 function focusOut(e){if(!grid.contains(e.relatedTarget)){focus=null;wake();}}
 function visibility(){cancelAnimationFrame(raf);raf=0;last=0;if(document.hidden){pointer=null;}else wake();}
 const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);if(visible)wake();else{cancelAnimationFrame(raf);raf=0;last=0;}},{threshold:0});observer.observe(grid);
 window.addEventListener('pointermove',move,{passive:true});window.addEventListener('scroll',wake,{passive:true});window.addEventListener('resize',wake,{passive:true});document.addEventListener('pointerout',leave);document.addEventListener('visibilitychange',visibility);grid.addEventListener('focusin',focusIn);grid.addEventListener('focusout',focusOut);media.addEventListener('change',wake);
 return ()=>{alive=false;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('pointermove',move);window.removeEventListener('scroll',wake);window.removeEventListener('resize',wake);document.removeEventListener('pointerout',leave);document.removeEventListener('visibilitychange',visibility);grid.removeEventListener('focusin',focusIn);grid.removeEventListener('focusout',focusOut);media.removeEventListener('change',wake);for(const s of states){s.light.style.opacity='0';s.edge.style.opacity='0';}};
}
root.ReportSpotlight={mount};
})(window);

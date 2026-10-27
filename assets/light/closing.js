(()=>{
 'use strict';
 const section=document.getElementById('closing'),canvas=document.getElementById('closing-particles');
 if(!section||!canvas)return;
 const ctx=canvas.getContext('2d',{alpha:false});if(!ctx)return;
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 let seed=13971;
 function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
 const dust=Array.from({length:12500},()=>({u:random(),angle:random()*Math.PI*2,r:Math.pow(random(),1.65),lane:Math.floor(random()*3),speed:.6+random()*.8,size:.3+random()*.95,light:random()}));
 const far=Array.from({length:270},()=>({x:random(),y:random(),s:.3+random()*1.1,a:random()*.3}));
 const near=Array.from({length:38},()=>({x:random(),y:random(),r:4+random()*20,a:.015+random()*.04}));
 const sprite=document.createElement('canvas');sprite.width=sprite.height=64;
 const sc=sprite.getContext('2d'),glow=sc.createRadialGradient(32,32,0,32,32,32);
 glow.addColorStop(0,'rgba(50,85,164,.7)');glow.addColorStop(.12,'rgba(78,116,181,.4)');glow.addColorStop(.4,'rgba(126,157,205,.1)');glow.addColorStop(1,'rgba(126,157,205,0)');
 sc.fillStyle=glow;sc.fillRect(0,0,64,64);
 let width=0,height=0,dpr=1,frame=0,visible=false,last=0,clock=0,entered=0;
 const pointer={x:0,y:0,tx:0,ty:0},clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 function resize(){
  const rect=section.getBoundingClientRect();width=rect.width;height=rect.height;dpr=Math.min(devicePixelRatio||1,1.65);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=`${width}px`;canvas.style.height=`${height}px`;ctx.setTransform(dpr,0,0,dpr,0,0);
  if(media.matches||!visible)draw();
 }
 function shape(u,lane,angle,r,order){
  const twist=u*7.8+lane*Math.PI*2/3+clock*.11,envelope=.24+Math.pow(Math.sin(Math.PI*u),2)*.56,scatter=(1-order)*.75;
  return [Math.sin(twist)*envelope+Math.cos(angle)*r*(.23+scatter)+Math.sin(u*5)*.22,(u-.5)*6.7+Math.sin(angle)*r*(.1+scatter*.5),Math.cos(twist)*envelope+Math.sin(angle)*r*(.35+scatter)];
 }
 function project(p){
  const a=-.22+pointer.x*.16,c=Math.cos(a),s=Math.sin(a),x=p[0]*c+p[2]*s,z=p[2]*c-p[0]*s;
  const depth=6.2/(6.2-z),mobile=width<1024,scale=Math.min(width*(mobile?.3:.225),height*(mobile?.19:.285));
  return {x:width*(mobile?.43:.29)+(x+pointer.x*.1)*scale*depth,y:height*(mobile?.63:.53)+(p[1]+pointer.y*.08)*scale*depth,depth};
 }
 function draw(){
  if(!width||!height)return;
  const order=media.matches?1:1-Math.pow(1-clamp(entered/3.1,0,1),3),mobile=width<1024;
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle='#fafaf8';ctx.fillRect(0,0,width,height);
  const cx=width*(mobile?.34:.24),cy=height*(mobile?.54:.22),haze=ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(width*.48,height*.77));
  haze.addColorStop(0,'#e9eff9');haze.addColorStop(.25,'#f0f3f9');haze.addColorStop(.63,'#f7f8fa');haze.addColorStop(1,'#fafaf8');ctx.fillStyle=haze;ctx.fillRect(0,0,width,height);
  ctx.globalCompositeOperation='source-over';
  for(const p of far){const x=(p.x*width*.65+pointer.x*9+width)%width,y=(p.y*height+Math.sin(clock*.08+p.x*5)*6+height)%height;ctx.globalAlpha=p.a;ctx.fillStyle='#a9bddc';ctx.fillRect(x,y,p.s,p.s);}
  // Three continuous centerlines keep the animated field readable.
  for(let lane=0;lane<3;lane++){
   ctx.beginPath();for(let n=0;n<=100;n++){const p=project(shape(n/100,lane,0,0,order));if(n===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);}
   ctx.lineWidth=.6;ctx.strokeStyle='#6e8fbe';ctx.globalAlpha=.13*order;ctx.stroke();
  }
  const amount=mobile?7000:dust.length;
  for(let i=0;i<amount;i++){
   const p=dust[i],u=(p.u+clock*.012*p.speed)%1,position=project(shape(u,p.lane,p.angle,p.r,order));
   const fade=Math.pow(Math.max(0,Math.sin(u*Math.PI)),.32),size=p.size*position.depth,brightness=(.3+p.light*.65)*fade;
   if(position.x<-20||position.x>width+20||position.y<-30||position.y>height+30)continue;
   ctx.globalAlpha=brightness;if(i%15===0){const r=size*5;ctx.drawImage(sprite,position.x-r,position.y-r,r*2,r*2);}
   ctx.fillStyle=p.light>.72?'#3255a4':p.light>.3?'#6287bf':'#a5bad8';
   if(size>1.2){ctx.beginPath();ctx.arc(position.x,position.y,size*.65,0,Math.PI*2);ctx.fill();}else ctx.fillRect(position.x,position.y,size,size);
  }
  for(const p of near){const x=p.x*width*.58+Math.sin(clock*.06+p.y*4)*13,y=(p.y*height+clock*2)%height;ctx.globalAlpha=p.a;ctx.drawImage(sprite,x-p.r,y-p.r,p.r*2,p.r*2);}
  const light=project(shape(.14,1,0,0,order)),radius=Math.min(width,height)*.32;ctx.globalAlpha=.12;ctx.drawImage(sprite,light.x-radius,light.y-radius,radius*2,radius*2);
  ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
 }
 function tick(now){
  frame=0;if(!visible||media.matches||document.hidden)return;
  const delta=last?Math.min((now-last)/1000,.05):0;last=now;clock+=delta;entered+=delta;
  pointer.x+=(pointer.tx-pointer.x)*.045;pointer.y+=(pointer.ty-pointer.y)*.045;draw();frame=requestAnimationFrame(tick);
 }
 function start(){if(visible&&!media.matches&&!document.hidden&&!frame){last=0;frame=requestAnimationFrame(tick);}}
 function stop(){cancelAnimationFrame(frame);frame=0;last=0;}
 section.addEventListener('pointermove',e=>{if(media.matches||e.pointerType==='touch')return;const r=section.getBoundingClientRect();pointer.tx=((e.clientX-r.left)/r.width-.5)*2;pointer.ty=((e.clientY-r.top)/r.height-.5)*2;},{passive:true});
 section.addEventListener('pointerleave',()=>{pointer.tx=pointer.ty=0;});
 const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const entry of entries){visible=entry.isIntersecting;document.body.classList.toggle('ending-is-active',entry.intersectionRatio>.52);if(visible){start();if(media.matches)draw();}else stop();}},{threshold:[0,.05,.52,.8]}):null;
 if(observer)observer.observe(section);else{visible=true;start();}
 media.addEventListener('change',()=>{stop();draw();start();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else start();});
 window.addEventListener('pagehide',stop);window.addEventListener('pageshow',start);
 const sizeObserver='ResizeObserver' in window?new ResizeObserver(resize):null;if(sizeObserver)sizeObserver.observe(section);else window.addEventListener('resize',resize);
 resize();
})();

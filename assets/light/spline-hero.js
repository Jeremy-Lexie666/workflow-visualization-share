/* Spline scene supplied in the user reference. Viewer pinned to 2.0.98. */
(function(root){
'use strict';
const VIEWER_URL='https://cdn.spline.design/@splinetool/viewer@2.0.98/build/spline-viewer.js';
let modulePromise;
function loadModule(){if(!modulePromise)modulePromise=import(VIEWER_URL);return modulePromise;}
function mount(host,options={}){
 const media=matchMedia('(prefers-reduced-motion: reduce)');
 const loadViewer=options.loadViewer||loadModule;
 let viewer=null,removeViewerEvents=()=>{},timer=0,pending=false,visible=false,disposed=false,failed=false,generation=0;
 function clearTimer(){if(timer){clearTimeout(timer);timer=0;}}
 function stop(){
  generation++;pending=false;clearTimer();removeViewerEvents();removeViewerEvents=()=>{};
  host.classList.remove('is-spline-ready');host.dataset.splineState='fallback';
  if(viewer){try{if(typeof viewer.unload==='function')viewer.unload();}catch{}viewer.remove();viewer=null;}
 }
 function fail(ticket){if(disposed||ticket!==generation)return;failed=true;stop();}
 function allowed(){return !disposed&&visible&&!document.hidden&&!media.matches&&!failed;}
 async function start(){
  if(!allowed()||pending||viewer)return;
  pending=true;host.dataset.splineState='loading';const ticket=++generation;
  timer=setTimeout(()=>fail(ticket),20000);
  try{
   await loadViewer();
   await customElements.whenDefined('spline-viewer');
   if(ticket!==generation||!allowed())return;
   const node=document.createElement('spline-viewer');viewer=node;
   node.setAttribute('url',host.dataset.sceneUrl);node.setAttribute('loading','eager');node.setAttribute('background',host.dataset.sceneBackground||'#f5f7fb');node.setAttribute('events-target','local');node.setAttribute('unloadable','');node.setAttribute('aria-hidden','true');node.setAttribute('tabindex','-1');
   const ready=()=>{if(ticket!==generation||!allowed())return;clearTimer();pending=false;host.classList.add('is-spline-ready');host.dataset.splineState='ready';};
   const error=()=>fail(ticket);
   node.addEventListener('load-complete',ready);node.addEventListener('error',error);node.addEventListener('splineerror',error);
   removeViewerEvents=()=>{node.removeEventListener('load-complete',ready);node.removeEventListener('error',error);node.removeEventListener('splineerror',error);};
   host.querySelector('.spline-stage').appendChild(node);
  }catch{fail(ticket);}
 }
 function reconcile(){if(allowed())start();else stop();}
 // Keep the browser's native vertical scrolling; don't send wheel zoom to the scene.
 function wheel(event){event.stopPropagation();}
 const observer=new IntersectionObserver(entries=>{visible=entries.some(e=>e.isIntersecting);reconcile();},{threshold:.01});observer.observe(host);
 host.addEventListener('wheel',wheel,{capture:true,passive:true});document.addEventListener('visibilitychange',reconcile);media.addEventListener('change',reconcile);
 return ()=>{disposed=true;stop();observer.disconnect();host.removeEventListener('wheel',wheel,true);document.removeEventListener('visibilitychange',reconcile);media.removeEventListener('change',reconcile);};
}
root.ReportSplineHero={mount};
})(window);

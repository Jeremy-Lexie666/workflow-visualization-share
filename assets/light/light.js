(()=>{
'use strict';
const sections=[...document.querySelectorAll('.page-section')];
const links=[...document.querySelectorAll('[data-section]')];
const media=matchMedia('(prefers-reduced-motion: reduce)');
let raf=0,pending=null,stopSpotlight=()=>{},stopSpline=()=>{},stopHeroLight=()=>{};
function setActive(id){const navId=document.getElementById(id)?.dataset.navSection||id;for(const link of links){if(link.dataset.section===navId)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}}
function update(){
 raf=0;
 let active=sections[0].id;
 for(const section of sections)if(section.getBoundingClientRect().top<=innerHeight*.4)active=section.id;
 if(pending){const target=document.getElementById(pending.id);if(Math.abs(target.getBoundingClientRect().top)<4||performance.now()>pending.until)pending=null;else active=pending.id;}
 setActive(active);
 if(active!=='showcase')pauseProductVideo();
}
function schedule(){if(!raf)raf=requestAnimationFrame(update);}
function go(id){const target=document.getElementById(id);if(!target)return;pending={id,until:performance.now()+1300};setActive(id);target.scrollIntoView({behavior:media.matches?'instant':'smooth',block:'start'});history.replaceState(null,'','#'+id);}
document.querySelectorAll('a[href^="#"]').forEach(link=>{const id=link.getAttribute('href').slice(1);if(sections.some(section=>section.id===id))link.addEventListener('click',e=>{e.preventDefault();go(id);});});
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});window.addEventListener('wheel',()=>{pending=null;},{passive:true});
window.addEventListener('hashchange',()=>{const id=location.hash.slice(1);if(sections.some(s=>s.id===id))go(id);});
function currentSectionIndex(){
 if(pending)return sections.findIndex(section=>section.id===pending.id);
 let index=0;for(let i=0;i<sections.length;i++)if(sections[i].getBoundingClientRect().top<=innerHeight*.4)index=i;
 return index;
}
document.addEventListener('keydown',e=>{
 if(e.ctrlKey||e.altKey||e.metaKey||e.target.closest('input,textarea,select,button,a,video,[contenteditable]'))return;
 const index=currentSectionIndex();let target;
 if(['ArrowRight','ArrowDown','PageDown',' '].includes(e.key))target=Math.min(index+1,sections.length-1);
 else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key))target=Math.max(index-1,0);
 else if(e.key==='Home')target=0;
 else if(e.key==='End')target=sections.length-1;
 if(target!==undefined){e.preventDefault();go(sections[target].id);}
});
if('IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}},{threshold:.12});observer.observe(document.getElementById('methods'));}
const methodGrid=document.querySelector('.method-grid');
if(methodGrid&&window.ReportSpotlight){
 stopSpotlight=window.ReportSpotlight.mount(methodGrid);
}
function mountHeroSpline(){const host=document.getElementById('hero-spline');return host&&window.ReportSplineHero?window.ReportSplineHero.mount(host):()=>{};}
stopSpline=mountHeroSpline();
function mountHeroLight(){const host=document.getElementById('hero-spotlight');return host&&window.ReportSpotlight?window.ReportSpotlight.mount(host):()=>{};}
stopHeroLight=mountHeroLight();
const milestoneStage=document.getElementById('milestone-stage');
if(milestoneStage){
 const stages=[
  {phase:'第一阶段',title:'流程节点可视化V1.0上线',items:['运营通过后台进行可视化流程查询。','导出流程节点表格，了解现有配置。']},
  {phase:'第二阶段',title:'运营试运行',items:['制定使用规范，用户按统一表格提交修改需求。','根据用户表格进行流程调整。','尝试将修改后导出的节点表与用户表格对照，辅助测试核验。']},
  {phase:'第三阶段',title:'开放流程查询',items:['向各校区及集团相关人员开放流程查询。','让用户能够自主了解相关流程的配置与审批节点。','用户可自行按照原有标准，提交需要调整的流程节点。']},
  {phase:'第四阶段',title:'产运自主调整',items:['产运人员可自行修改流程节点。','逐步降低常规节点调整对研发的依赖。']}
 ];
 const tabs=[...milestoneStage.querySelectorAll('[role="tab"]')],panel=document.getElementById('milestone-panel'),content=document.getElementById('milestone-content');
 const curve=document.getElementById('milestone-curve'),stem=document.getElementById('milestone-stem'),rail=document.getElementById('milestone-rail');
 let selected=0,position=125,curveFrame=0,contentAnimation=null;
 function draw(x){curve.setAttribute('d',`M 0 75 H ${x-100} C ${x-50} 75 ${x-50} 20 ${x} 20 C ${x+50} 20 ${x+50} 75 ${x+100} 75 H 1000`);stem.setAttribute('d',`M ${x} 0 V 20`);rail.style.setProperty('--milestone-point-x',`${x/10}%`);}
 function selectStage(index,focus=false){
  if(index===selected){if(focus)tabs[index].focus();return;}
  selected=index;const stage=stages[index];
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  panel.setAttribute('aria-labelledby',tabs[index].id);
  content.querySelector('.milestone-card-meta').firstElementChild.textContent=stage.phase;
  content.querySelector('h3').textContent=stage.title;
  content.querySelector('ul').replaceChildren(...stage.items.map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));
  content.querySelector('.milestone-card-number').textContent=String(index+1).padStart(2,'0');
  milestoneStage.style.setProperty('--milestone-card-x',`${Math.max(26,Math.min(74,12.5+index*25))}%`);
  if(contentAnimation)contentAnimation.cancel();
  if(!media.matches&&content.animate)contentAnimation=content.animate([{opacity:.15,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'ease-out'});
  cancelAnimationFrame(curveFrame);const from=position,to=125+index*250,start=performance.now();
  if(media.matches){position=to;draw(to);}else{const move=now=>{const t=Math.min(1,(now-start)/650);position=from+(to-from)*(1-Math.pow(1-t,3));draw(position);if(t<1)curveFrame=requestAnimationFrame(move);};curveFrame=requestAnimationFrame(move);}
  if(focus)tabs[index].focus();
 }
 tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectStage(index));
  tab.addEventListener('keydown',event=>{let next=index;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;event.preventDefault();event.stopPropagation();selectStage(next,true);});
 });
}
const productVideo=document.getElementById('product-video');
const productPlay=document.getElementById('product-video-start');
function pauseProductVideo(){if(productVideo&&!productVideo.paused)productVideo.pause();}
if(productVideo&&productPlay){
 const status=document.getElementById('product-player-status');
 let starting=false;
 const source=()=>productVideo.getAttribute('src')||productVideo.dataset.src||productVideo.querySelector('source[src]')?.getAttribute('src')||'';
 function message(text){if(status){status.textContent=text;status.hidden=!text;}}
 function showCover(){productVideo.hidden=true;productVideo.controls=false;productPlay.hidden=false;productPlay.removeAttribute('aria-busy');productPlay.setAttribute('aria-label','播放产品展示视频');}
 showCover();
 productPlay.addEventListener('click',async()=>{
  if(starting)return;
  if(!source()){message('视频待提供');return;}
  starting=true;message('');productPlay.setAttribute('aria-busy','true');productPlay.setAttribute('aria-label','正在加载产品展示视频');
  if(!productVideo.getAttribute('src')&&productVideo.dataset.src)productVideo.src=productVideo.dataset.src;
  productVideo.hidden=false;productVideo.controls=true;
  try{await productVideo.play();productPlay.hidden=true;}
  catch(error){showCover();if(error.name!=='AbortError')message('视频暂时无法播放，请重试。');}
  finally{starting=false;productPlay.removeAttribute('aria-busy');}
 });
 productVideo.addEventListener('playing',()=>{productPlay.hidden=true;message('');});
 productVideo.addEventListener('ended',()=>{showCover();productVideo.currentTime=0;});
 productVideo.addEventListener('error',()=>{starting=false;showCover();message('视频暂时无法播放，请重试。');});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pauseProductVideo();});
}
window.addEventListener('pagehide',()=>{pauseProductVideo();stopSpotlight();stopSpotlight=()=>{};stopSpline();stopSpline=()=>{};stopHeroLight();stopHeroLight=()=>{};});
window.addEventListener('pageshow',e=>{if(e.persisted){stopSpline=mountHeroSpline();stopHeroLight=mountHeroLight();}if(e.persisted&&methodGrid&&window.ReportSpotlight)stopSpotlight=window.ReportSpotlight.mount(methodGrid);});
update();
})();

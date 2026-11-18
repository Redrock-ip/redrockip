(() => {
 'use strict';
 const root=document.documentElement;
 const nav=document.querySelector('#nav');
 const menu=document.querySelector('.menu');
 const header=document.querySelector('header');
 const motion=document.querySelector('.motion-control');
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
 let saved;
 try{saved=localStorage.getItem('redrock-motion');}catch{}
 let enabled=saved?saved==='on':!preference.matches;
 function updateMotion(){
  root.dataset.motion=enabled?'on':'off';
  if(!motion)return;
  motion.setAttribute('aria-pressed',String(enabled));
  motion.setAttribute('aria-label',enabled?'暂停页面动态效果':'开启页面动态效果');
  motion.querySelector('#motion-label').textContent=enabled?'暂停动效':'开启动效';
  motion.querySelector('.motion-icon').textContent=enabled?'Ⅱ':'▷';
 }
 updateMotion();
 motion?.addEventListener('click',()=>{enabled=!enabled;saved=enabled?'on':'off';try{localStorage.setItem('redrock-motion',saved);}catch{}updateMotion();});
 preference.addEventListener('change',()=>{if(saved==null){enabled=!preference.matches;updateMotion();}});
 const dropdowns=[...document.querySelectorAll('.nav-dropdown')];
 function closeDropdown(detail){if(typeof window.redrockCloseNavMenu==='function')window.redrockCloseNavMenu(detail);else detail.open=false;}
 function closeDropdowns(){dropdowns.forEach(closeDropdown);}
 function closeMenu(){if(!nav||!menu)return;nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','展开导航');closeDropdowns();}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'收起导航':'展开导航');nav.classList.toggle('open',open);if(!open)closeDropdowns();});
 nav?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
 document.addEventListener('click',event=>{if(!header?.contains(event.target))closeMenu();else if(!event.target.closest('.nav-dropdown'))closeDropdowns();});
 document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  const open=dropdowns.find(detail=>detail.open&&!detail.dataset?.navClosing);
  if(open){closeDropdown(open);open.querySelector('summary').focus();return;}
  if(menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}
 });
 let queued=false;
 function onScroll(){
  const distance=root.scrollHeight-window.innerHeight;
  root.style.setProperty('--scroll',distance>0?String(Math.max(0,Math.min(1,window.scrollY/distance))):'0');
  header?.classList.toggle('is-scrolled',window.scrollY>12);queued=false;
 }
 function queueScroll(){if(queued)return;queued=true;requestAnimationFrame(onScroll);}
 window.addEventListener('scroll',queueScroll,{passive:true});
 window.addEventListener('resize',()=>{if(window.innerWidth>900)closeMenu();queueScroll();},{passive:true});
 onScroll();
 if('IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.04,rootMargin:'0px 0px -16px 0px'});
  document.querySelectorAll('.page-intro,.content-section').forEach(element=>{element.classList.add('reveal');observer.observe(element);});
 }
 root.classList.add('motion-ready');
})();

(() => {
 'use strict';
 const root=document.documentElement;
 const $=selector=>document.querySelector(selector);
 const sidebar=$('#workspace-sidebar'),shell=$('#workspace-shell'),overlay=$('#workspace-overlay'),menu=$('#workspace-menu'),sidebarClose=$('#sidebar-close');
 let drawerOpen=false,previousOverflow='';
 function setDrawer(open,restore=true){
  open=Boolean(open&&window.innerWidth<=800);
  if(open&&!drawerOpen)previousOverflow=document.body.style.overflow;
  drawerOpen=open;sidebar.classList.toggle('is-open',open);overlay.hidden=!open;menu.setAttribute('aria-expanded',String(open));
  const mobile=window.innerWidth<=800;sidebar.inert=mobile&&!open;shell.inert=open;
  if(open){sidebar.setAttribute('role','dialog');sidebar.setAttribute('aria-modal','true');document.body.style.overflow='hidden';sidebarClose.focus();}
  else{sidebar.removeAttribute('role');sidebar.removeAttribute('aria-modal');document.body.style.overflow=previousOverflow;if(restore&&mobile)menu.focus();}
 }
 menu.addEventListener('click',()=>setDrawer(!drawerOpen));sidebarClose.addEventListener('click',()=>setDrawer(false));overlay.addEventListener('click',()=>setDrawer(false));
 sidebar.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{if(drawerOpen)setDrawer(false,false);}));
 const userMenu=$('#user-menu');
 document.addEventListener('click',event=>{if(!userMenu.contains(event.target))userMenu.open=false;});
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){if(drawerOpen){event.preventDefault();setDrawer(false);}else if(userMenu.open){userMenu.open=false;userMenu.querySelector('summary').focus();}}
  if(event.key==='Tab'&&drawerOpen){const targets=[...sidebar.querySelectorAll('a[href],button,summary,[tabindex="0"]')].filter(element=>element.getClientRects().length>0);const first=targets[0],last=targets.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}}
 });
 window.addEventListener('resize',()=>setDrawer(drawerOpen,false),{passive:true});setDrawer(false,false);
 const preference=window.matchMedia('(prefers-reduced-motion: reduce)');let saved;try{saved=localStorage.getItem('redrock-motion');}catch{}
 let motionEnabled=saved?saved==='on':!preference.matches;
 const motion=$('.motion-control');
 function setMotion(){root.dataset.motion=motionEnabled?'on':'off';motion.setAttribute('aria-pressed',String(motionEnabled));motion.setAttribute('aria-label',motionEnabled?'Pause page animations':'Enable page animations');$('#motion-label').textContent=motionEnabled?'Pause motion':'Enable motion';$('.motion-icon').textContent=motionEnabled?'Ⅱ':'▷';}
 motion.addEventListener('click',()=>{motionEnabled=!motionEnabled;saved=motionEnabled?'on':'off';try{localStorage.setItem('redrock-motion',saved);}catch{}setMotion();});preference.addEventListener('change',()=>{if(saved==null){motionEnabled=!preference.matches;setMotion();}});setMotion();
})();

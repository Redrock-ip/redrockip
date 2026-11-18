(() => {
 'use strict';
 const root=document.documentElement;
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const animations=new Set();
 const carousels=[];
 const motionAllowed=()=>root.dataset.motion==='on'||(root.dataset.motion!=='off'&&!reduce.matches);
 const cancelAnimations=()=>{animations.forEach(animation=>animation.cancel());animations.clear();};
 function syncMotion(){
  cancelAnimations();
  if(!motionAllowed())carousels.forEach(controller=>controller.stopSmooth());
 }

 document.querySelectorAll('.home-product-carousel').forEach(wrapper=>{
  const track=wrapper.querySelector('.product-carousel-track');
  if(!track)return;
  const cards=[...track.querySelectorAll('[data-product-card]')];
  if(!cards.length)return;
  const previous=wrapper.querySelector('[data-carousel-prev]');
  const next=wrapper.querySelector('[data-carousel-next]');
  const progress=wrapper.querySelector('[data-carousel-progress]');
  const fill=progress?.querySelector('span');
  const count=wrapper.querySelector('[data-carousel-count]');
  let offsets=[],widths=[],queued=false,drag=null,suppressClick=false;
  cards.forEach(card=>card.classList.add('is-visible'));
  if(!track.hasAttribute('tabindex'))track.setAttribute('tabindex','0');
  if(!track.hasAttribute('role'))track.setAttribute('role','region');
  if(!track.hasAttribute('aria-label'))track.setAttribute('aria-label','代理产品，可使用左右方向键切换');
  if(count){count.setAttribute('aria-live','polite');count.setAttribute('aria-atomic','true');}
  progress?.setAttribute('aria-hidden','true');
  const maximum=()=>Math.max(0,track.scrollWidth-track.clientWidth);
  const position=()=>Math.max(0,Math.min(maximum(),track.scrollLeft));
  function measure(){
   const first=cards[0].offsetLeft;
   offsets=cards.map(card=>card.offsetLeft-first);
   widths=cards.map(card=>card.offsetWidth);
   update();
  }
  function update(){
   const left=position(),max=maximum(),right=left+track.clientWidth;
   if(previous)previous.disabled=left<=2;
   if(next)next.disabled=max<=2||left>=max-2;
   const visible=cards.map((card,index)=>index).filter(index=>offsets[index]+widths[index]>left+2&&offsets[index]<right-2);
   const first=visible.length?visible[0]:0,last=visible.length?visible.at(-1):0;
   if(count){
    const label=`${String(first+1).padStart(2,'0')}–${String(last+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
    if(count.textContent!==label)count.textContent=label;
   }
   if(fill)fill.style.transform=`scaleX(${Math.max(0,Math.min(1,right/Math.max(1,track.scrollWidth)))})`;
   queued=false;
  }
  function queue(){if(queued)return;queued=true;window.requestAnimationFrame(update);}
  function go(left,smooth=true){
   const target=Math.max(0,Math.min(maximum(),left));
   track.scrollTo({left:target,behavior:smooth&&motionAllowed()?'smooth':'instant'});
   queue();
  }
  function currentIndex(){
   const left=position();let index=0;
   offsets.forEach((offset,item)=>{if(offset<=left+2)index=item;});
   return index;
  }
  function page(direction){
   const step=offsets.length>1?offsets[1]-offsets[0]:widths[0];
   const gap=Math.max(0,step-widths[0]);
   const size=Math.max(1,Math.floor((track.clientWidth+gap+1)/Math.max(1,step)));
   const target=Math.max(0,Math.min(cards.length-1,currentIndex()+direction*size));
   go(offsets[target]);
  }
  previous?.addEventListener('click',()=>page(-1));
  next?.addEventListener('click',()=>page(1));
  track.addEventListener('scroll',queue,{passive:true});
  track.addEventListener('keydown',event=>{
   if(event.target!==track||event.altKey||event.ctrlKey||event.metaKey)return;
   let target;
   if(event.key==='ArrowRight')target=offsets[Math.min(cards.length-1,currentIndex()+1)];
   else if(event.key==='ArrowLeft')target=offsets[Math.max(0,currentIndex()-1)];
   else if(event.key==='Home')target=0;
   else if(event.key==='End')target=maximum();
   else return;
   event.preventDefault();go(target);
  });
  const interactive='a,button,input,select,textarea,summary,details,[role="button"],[contenteditable]:not([contenteditable="false"])';
  track.addEventListener('pointerdown',event=>{
   suppressClick=false;
   if(event.pointerType!=='mouse'||event.button!==0||event.target.closest?.(interactive))return;
   go(position(),false);
   drag={pointer:event.pointerId,x:event.clientX,y:event.clientY,left:position(),active:false};
  });
  track.addEventListener('pointermove',event=>{
   if(!drag||event.pointerId!==drag.pointer)return;
   const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
   if(!drag.active){
    if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>6){drag=null;return;}
    if(Math.abs(dx)<6)return;
    drag.active=true;track.classList.add('is-dragging');
    track.setPointerCapture?.(event.pointerId);
   }
   if(event.cancelable)event.preventDefault();
   track.scrollLeft=drag.left-dx;
  });
  function finishDrag(event){
   if(!drag||event.pointerId!==drag.pointer)return;
   const wasDragging=drag.active,pointer=drag.pointer;
   drag=null;track.classList.remove('is-dragging');
   if(track.hasPointerCapture?.(pointer))track.releasePointerCapture(pointer);
   if(wasDragging){
    suppressClick=true;
    const left=position();
    const closest=offsets.reduce((best,offset)=>Math.abs(offset-left)<Math.abs(best-left)?offset:best,0);
    go(closest);
   }
  }
  track.addEventListener('pointerup',finishDrag);
  track.addEventListener('pointercancel',finishDrag);
  track.addEventListener('lostpointercapture',finishDrag);
  track.addEventListener('pointerleave',event=>{if(drag&&!drag.active)finishDrag(event);});
  track.addEventListener('click',event=>{
   if(suppressClick&&event.detail!==0){event.preventDefault();event.stopImmediatePropagation();suppressClick=false;}
  },true);
  const controller={stopSmooth:()=>{go(position(),false);},measure};carousels.push(controller);
  if('ResizeObserver'in window)new ResizeObserver(measure).observe(track);
  window.addEventListener('resize',measure,{passive:true});
  measure();
 });

 const filters=document.querySelector('[data-catalog-filters]');
 if(filters){
  const cards=[...document.querySelectorAll('.catalog-solution[data-product-family]')];
  filters.addEventListener('click',event=>{
   const button=event.target.closest?.('[data-product-filter]');
   if(!button||!filters.contains(button))return;
   cancelAnimations();
   if(!motionAllowed())return;
   cards.filter(card=>!card.hidden).forEach((card,index)=>{
    if(!card.animate)return;
    const animation=card.animate([{opacity:0,transform:'translateX(18px)'},{opacity:1,transform:'translateX(0)'}],{duration:420,delay:Math.min(index*45,180),easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    animations.add(animation);
    animation.onfinish=()=>{animations.delete(animation);animation.cancel();};
    animation.oncancel=()=>animations.delete(animation);
   });
  });
 }
 new MutationObserver(syncMotion).observe(root,{attributes:true,attributeFilter:['data-motion']});
 reduce.addEventListener('change',syncMotion);
 const syncVisibility=()=>{root.classList.toggle('product-motion-hidden',document.hidden);if(document.hidden)cancelAnimations();};
 document.addEventListener('visibilitychange',syncVisibility);syncVisibility();
})();

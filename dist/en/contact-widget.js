(() => {
 'use strict';
 const dialog=document.querySelector('#contact-dialog');
 const launcher=document.querySelector('#contact-launcher');
 const closeButton=document.querySelector('#contact-dialog-close');
 const wecomToggle=document.querySelector('#contact-wecom-toggle');
 const wecomPanel=document.querySelector('#contact-wecom-panel');
 const widgetStatus=document.querySelector('#contact-widget-status');
 const emailChannel=document.querySelector('.contact-email-channel');
 const supportEmail=emailChannel?.getAttribute('href');
 let opener=null,backdropStart=false;
 function setWecom(expanded){
  if(!wecomToggle||!wecomPanel)return;
  wecomToggle.setAttribute('aria-expanded',String(expanded));
  wecomToggle.setAttribute('aria-label',expanded?'WeCom, hide QR code':'WeCom, show QR code');
  wecomPanel.hidden=!expanded;
  const label=wecomToggle.querySelector('[data-wecom-label]');
  if(label)label.textContent=expanded?'Hide QR code':'Show QR code';
 }
 function openContact(trigger,{expandWecom=false,focusWecom=false}={}){
  if(!dialog||typeof dialog.showModal!=='function')return false;
  if(!dialog.open){
   opener=trigger||document.activeElement;
   if(widgetStatus)widgetStatus.textContent='';
   const product=trigger?.dataset.contactProduct;
   if(supportEmail){
    emailChannel.setAttribute('href', product ? supportEmail+'?subject='+encodeURIComponent('Product enquiry: '+product) : supportEmail);
   }
   setWecom(expandWecom);
   dialog.showModal();
   launcher?.setAttribute('aria-expanded','true');
  }
  if(focusWecom)wecomToggle?.focus({preventScroll:true});
  return true;
 }
 function closeContact(){if(dialog?.open)dialog.close();}
 if(dialog){
  launcher?.setAttribute('aria-expanded',String(dialog.open));
  launcher?.addEventListener('click',()=>openContact(launcher));
  closeButton?.setAttribute('aria-label','Close contact dialog');
  closeButton?.addEventListener('click',closeContact);
  wecomToggle?.addEventListener('click',()=>setWecom(wecomToggle.getAttribute('aria-expanded')!=='true'));
  function outside(event){const box=dialog.getBoundingClientRect();return event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom;}
  dialog.addEventListener('pointerdown',event=>{backdropStart=event.target===dialog&&outside(event);});
  dialog.addEventListener('pointercancel',()=>{backdropStart=false;});
  dialog.addEventListener('click',event=>{
   const close=backdropStart&&event.target===dialog&&outside(event);
   backdropStart=false;
   if(close)closeContact();
  });
  // Native Escape cancellation closes the modal and dispatches the same close event.
  dialog.addEventListener('close',()=>{
   backdropStart=false;launcher?.setAttribute('aria-expanded','false');
   const target=opener;opener=null;
   if(target?.isConnected!==false&&typeof target?.focus==='function')target.focus({preventScroll:true});
  });
 }
 document.querySelectorAll('[data-open-contact]').forEach(link=>link.addEventListener('click',event=>{
  if(event.defaultPrevented||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  if(openContact(link,{expandWecom:true}))event.preventDefault();
 }));
 document.querySelectorAll('[data-open-contact-wecom]').forEach(button=>button.addEventListener('click',()=>openContact(button,{expandWecom:true,focusWecom:true})));
 document.querySelectorAll('[data-contact-copy]').forEach(button=>{
  const originalLabel=button.getAttribute('aria-label');let feedbackTimer=null;
  function announce(message,short){
   const local=button.closest('section,article,[data-contact-copy-group]')?.querySelector('[data-contact-copy-status]');
   const pageStatus=local||document.querySelector('[data-contact-copy-status]');
   const status=dialog?.open&&dialog.contains(button)?widgetStatus:pageStatus;
   if(status)status.textContent=message;
   button.dataset.contactFeedback=short;
   button.setAttribute('aria-label',message);
   if(feedbackTimer!==null)window.clearTimeout(feedbackTimer);
   feedbackTimer=window.setTimeout(()=>{
    delete button.dataset.contactFeedback;
    if(originalLabel===null)button.removeAttribute('aria-label');else button.setAttribute('aria-label',originalLabel);
    feedbackTimer=null;
   },2600);
  }
  button.addEventListener('click',async()=>{
   const value=(button.dataset.copyText||'').trim();
   if(!value){announce('No contact username is available to copy.','No username');return;}
   try{
    if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    announce(`Copied: ${value}`,'Copied');
   }catch{announce(`Could not copy automatically. Copy manually: ${value}`,`Copy manually: ${value}`);}
  });
 });
})();

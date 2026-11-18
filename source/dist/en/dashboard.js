(() => {
 'use strict';
 const root=document.documentElement;
 const $=selector=>document.querySelector(selector);
 const sampleOrders=[
  {name:'Rotating Residential · 10 GB',id:'DEMO-1005',amount:'24.00',status:'paid'},
  {name:'Static Residential · 2 IPs',id:'DEMO-1004',amount:'12.00',status:'paid'},
  {name:'Mobile Proxies · 5 GB',id:'DEMO-1003',amount:'18.00',status:'pending'},
  {name:'Datacenter Proxies · 4 IPs',id:'DEMO-1002',amount:'8.00',status:'paid'},
  {name:'Static Residential · 2 IPs',id:'DEMO-1001',amount:'12.00',status:'paid'}
 ];
 let sampleMode=true;
 const mode=$('#data-mode'),search=$('#order-search'),filter=$('#order-status');
 const status=$('#workspace-status');
 function renderOrders(){
  const query=search.value.trim().normalize('NFKC').toLocaleLowerCase();
  const rows=sampleMode?sampleOrders.filter(order=>(filter.value==='all'||order.status===filter.value)&&(order.name+' '+order.id).normalize('NFKC').toLocaleLowerCase().includes(query)):[];
  const body=$('#order-rows');body.replaceChildren();
  rows.forEach(order=>{
   const row=document.createElement('tr'),product=document.createElement('td'),amount=document.createElement('td'),state=document.createElement('td');
   const name=document.createElement('strong'),id=document.createElement('small'),badge=document.createElement('span');
   name.textContent=order.name;id.textContent=order.id+' · Sample';product.append(name,id);
   amount.textContent=order.amount+' USDT';badge.className='workspace-order-status'+(order.status==='pending'?' is-pending':'');badge.textContent=order.status==='paid'?'Paid':'Pending';state.append(badge);row.append(product,amount,state);body.append(row);
  });
  $('#orders-table-wrap').hidden=rows.length===0;$('#orders-empty').hidden=rows.length>0;
  $('#empty-title').textContent=sampleMode?'No matching sample orders':'Account data is not connected';
  $('#empty-description').textContent=sampleMode?'Try another keyword or reset the filters.':'View real orders in the original-site dashboard.';
  $('#order-count').textContent=sampleMode?`Showing ${rows.length} of ${sampleOrders.length} sample orders`:'Waiting for account data';
  $('#order-sample-label').textContent=sampleMode?'Sample orders':'Not a real account';
 }
 function renderMode(announce=true){
  root.dataset.previewState=sampleMode?'sample':'unconnected';
  mode.setAttribute('aria-pressed',String(sampleMode));mode.textContent=sampleMode?'Show disconnected state':'Show sample data';
  $('#preview-description').textContent=sampleMode?'Sample data · Not a real account. Figures and orders illustrate the interface. No account data has been retrieved.':'Account data is not connected. Sign in on the original site to view your balance, traffic, resources and orders.';
  const values={'balance-value':sampleMode?'28.00':'—','dynamic-remaining':sampleMode?'6.40':'—','dynamic-total':sampleMode?'10.00 GB':'—','mobile-remaining':sampleMode?'3.20':'—','mobile-total':sampleMode?'5.00 GB':'—','static-count':sampleMode?'4':'—','datacenter-count':sampleMode?'8':'—'};
  Object.entries(values).forEach(([id,value])=>$('#'+id).textContent=value);
  $('#balance-caption').textContent=sampleMode?'Sample balance':'Waiting for real account data';$('#ip-caption').textContent=sampleMode?'Sample resource count':'Waiting for real resource data';
  ['dynamic','mobile'].forEach(type=>{
   const meter=$('#'+type+'-meter');$('#'+type+'-meter-fill').style.width=sampleMode?'36%':'0%';
   if(sampleMode){meter.setAttribute('aria-valuenow','36');meter.setAttribute('aria-valuetext','Sample: 36% used');}
   else{meter.removeAttribute('aria-valuenow');meter.setAttribute('aria-valuetext','Account data is not connected');}
   $('#'+type+'-caption').textContent=sampleMode?(type==='dynamic'?'3.60 GB used':'1.80 GB used'):'Waiting for usage data';
  });
  search.disabled=!sampleMode;filter.disabled=!sampleMode;$('#order-reset').disabled=!sampleMode;
  $('#notice-open').hidden=!sampleMode;$('#notice-empty').hidden=sampleMode;$('#notice-state').textContent=sampleMode?'Sample':'Disconnected';
  renderOrders();
  if(announce)status.textContent=sampleMode?'Sample mode enabled. All figures and orders are interface samples.':'Switched to the disconnected state. No real account information has been queried.';
 }
 mode.addEventListener('click',()=>{sampleMode=!sampleMode;search.value='';filter.value='all';renderMode();});
 search.addEventListener('input',renderOrders);filter.addEventListener('change',renderOrders);
 $('#order-reset').addEventListener('click',()=>{search.value='';filter.value='all';renderOrders();search.focus();});
 renderMode(false);
 const dialog=$('#notice-dialog');
 $('#notice-open').addEventListener('click',()=>{if(sampleMode)dialog.showModal();});
 $('#notice-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();});
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

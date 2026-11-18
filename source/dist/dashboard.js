(() => {
 'use strict';
 const root=document.documentElement;
 const $=selector=>document.querySelector(selector);
 const sampleOrders=[
  {name:'动态住宅代理 · 10 GB',id:'DEMO-1005',amount:'24.00',status:'paid'},
  {name:'静态住宅代理 · 2 个 IP',id:'DEMO-1004',amount:'12.00',status:'paid'},
  {name:'移动代理 · 5 GB',id:'DEMO-1003',amount:'18.00',status:'pending'},
  {name:'数据中心代理 · 4 个 IP',id:'DEMO-1002',amount:'8.00',status:'paid'},
  {name:'静态住宅代理 · 2 个 IP',id:'DEMO-1001',amount:'12.00',status:'paid'}
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
   name.textContent=order.name;id.textContent=order.id+' · 示例';product.append(name,id);
   amount.textContent=order.amount+' USDT';badge.className='workspace-order-status'+(order.status==='pending'?' is-pending':'');badge.textContent=order.status==='paid'?'已支付':'待支付';state.append(badge);row.append(product,amount,state);body.append(row);
  });
  $('#orders-table-wrap').hidden=rows.length===0;$('#orders-empty').hidden=rows.length>0;
  $('#empty-title').textContent=sampleMode?'没有匹配的示例订单':'账户数据尚未接入';
  $('#empty-description').textContent=sampleMode?'试试其他关键词或重置筛选条件。':'请前往原站控制台查看真实订单。';
  $('#order-count').textContent=sampleMode?`显示 ${rows.length} / ${sampleOrders.length} 条示例订单`:'等待账户数据';
  $('#order-sample-label').textContent=sampleMode?'示例订单':'非真实账户';
 }
 function renderMode(announce=true){
  root.dataset.previewState=sampleMode?'sample':'unconnected';
  mode.setAttribute('aria-pressed',String(sampleMode));mode.textContent=sampleMode?'查看未接入状态':'查看示例数据';
  $('#preview-description').textContent=sampleMode?'示例数据 · 非真实账户　以下数字与订单仅用于展示界面，未读取原站账户。':'未接入账户数据　余额、流量、资源数量及订单将在原站登录后显示。';
  const values={'balance-value':sampleMode?'28.00':'—','dynamic-remaining':sampleMode?'6.40':'—','dynamic-total':sampleMode?'10.00 GB':'—','mobile-remaining':sampleMode?'3.20':'—','mobile-total':sampleMode?'5.00 GB':'—','static-count':sampleMode?'4':'—','datacenter-count':sampleMode?'8':'—'};
  Object.entries(values).forEach(([id,value])=>$('#'+id).textContent=value);
  $('#balance-caption').textContent=sampleMode?'示例余额':'等待真实账户数据';$('#ip-caption').textContent=sampleMode?'示例资源数量':'等待真实资源信息';
  ['dynamic','mobile'].forEach(type=>{
   const meter=$('#'+type+'-meter');$('#'+type+'-meter-fill').style.width=sampleMode?'36%':'0%';
   if(sampleMode){meter.setAttribute('aria-valuenow','36');meter.setAttribute('aria-valuetext','示例：已用 36%');}
   else{meter.removeAttribute('aria-valuenow');meter.setAttribute('aria-valuetext','尚未接入账户数据');}
   $('#'+type+'-caption').textContent=sampleMode?(type==='dynamic'?'已用 3.60 GB':'已用 1.80 GB'):'等待用量数据';
  });
  search.disabled=!sampleMode;filter.disabled=!sampleMode;$('#order-reset').disabled=!sampleMode;
  $('#notice-open').hidden=!sampleMode;$('#notice-empty').hidden=sampleMode;$('#notice-state').textContent=sampleMode?'示例':'未接入';
  renderOrders();
  if(announce)status.textContent=sampleMode?'已切换到示例模式。所有数字和订单均为界面示例。':'已切换到未接入状态，未查询任何真实账户信息。';
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
 function setMotion(){root.dataset.motion=motionEnabled?'on':'off';motion.setAttribute('aria-pressed',String(motionEnabled));motion.setAttribute('aria-label',motionEnabled?'暂停页面动态效果':'开启页面动态效果');$('#motion-label').textContent=motionEnabled?'暂停动效':'开启动效';$('.motion-icon').textContent=motionEnabled?'Ⅱ':'▷';}
 motion.addEventListener('click',()=>{motionEnabled=!motionEnabled;saved=motionEnabled?'on':'off';try{localStorage.setItem('redrock-motion',saved);}catch{}setMotion();});preference.addEventListener('change',()=>{if(saved==null){motionEnabled=!preference.matches;setMotion();}});setMotion();
})();

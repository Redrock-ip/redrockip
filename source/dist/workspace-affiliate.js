(() => {
 'use strict';
 const main=document.querySelector('main[data-workspace-page="affiliate"]');
 if(!main)return;
 const $=selector=>main.querySelector(selector);
 const invites=[
  {id:'DEMO-INV-003',user:'de***03@example.com',date:'2026-11-17',state:'registered'},
  {id:'DEMO-INV-002',user:'de***02@example.com',date:'2026-11-16',state:'linked'},
  {id:'DEMO-INV-001',user:'de***01@example.com',date:'2026-11-14',state:'linked'}
 ];
 const commissions=[
  {id:'DEMO-COM-002',order:'DEMO-ORD-008',user:'de***02@example.com',date:'2026-11-17',amount:1.20,state:'pending'},
  {id:'DEMO-COM-001',order:'DEMO-ORD-004',user:'de***01@example.com',date:'2026-11-16',amount:2.40,state:'settled'}
 ];
 const demoLink='https://example.com/register?invitecode=DEMO-ONLY';
 const mode=$('#affiliate-mode'),search=$('#affiliate-search'),filter=$('#affiliate-filter'),copy=$('#affiliate-copy'),link=$('#affiliate-link'),status=$('#affiliate-status');
 const tabs=[...main.querySelectorAll('[data-affiliate-tab]')];
 let sample=false,tab='invites';
 const normalize=value=>value.normalize('NFKC').toLocaleLowerCase().trim();
 const money=value=>'$'+value.toFixed(2);
 const sum=(items,predicate=()=>true)=>items.filter(predicate).reduce((total,row)=>total+row.amount,0);
 const labels={all:'全部状态',registered:'已注册',linked:'已关联',pending:'待结算',settled:'已结算'};
 function setFilterOptions(){
  filter.replaceChildren();
  (tab==='invites'?['all','registered','linked']:['all','pending','settled']).forEach(value=>{const option=document.createElement('option');option.value=value;option.textContent=labels[value];filter.append(option);});
  filter.value='all';
 }
 function makeCell(value){const cell=document.createElement('td');cell.textContent=value;return cell;}
 function renderRows(){
  const rows=tab==='invites'?invites:commissions;
  const terms=normalize(search.value).split(/\s+/u).filter(Boolean);
  const visible=sample?rows.filter(row=>(filter.value==='all'||row.state===filter.value)&&terms.every(term=>normalize(row.id+' '+row.user+' '+(row.order||'')+' '+row.date+' '+labels[row.state]).includes(term))):[];
  ['invites','commissions'].forEach(type=>{
   const panel=$('#affiliate-'+type+'-panel');panel.hidden=type!==tab;
   $('#affiliate-'+type+'-rows').replaceChildren();
   $('#affiliate-'+type+'-table').hidden=type!==tab||visible.length===0;
  });
  const tbody=$('#affiliate-'+tab+'-rows');
  visible.forEach(row=>{
   const tr=document.createElement('tr'),identifier=document.createElement('td'),title=document.createElement('strong');title.textContent=row.id;identifier.append(title);
   if(tab==='commissions'){const order=document.createElement('small');order.textContent=row.order;identifier.append(order);}
   const state=document.createElement('td'),badge=document.createElement('span');badge.className='ws-affiliate-record-status'+(row.state==='pending'?' is-pending':row.state==='registered'?' is-neutral':'');badge.textContent=labels[row.state];state.append(badge);
   tr.append(identifier,makeCell(row.user));
   if(tab==='commissions')tr.append(makeCell(money(row.amount)),state,makeCell(row.date));else tr.append(makeCell(row.date),state);
   tbody.append(tr);
  });
  $('#affiliate-empty').hidden=visible.length>0;
  $('#affiliate-empty-title').textContent=sample?'没有匹配的示例记录':'推广记录尚未接入';
  $('#affiliate-empty-description').textContent=sample?'试试其他关键词，或重置筛选条件。':'登录原站查看专属邀请链接、有效邀请与佣金明细。';
  $('#affiliate-empty-link').hidden=sample;
  $('#affiliate-result-count').textContent=sample?`显示 ${visible.length} / ${rows.length} 条示例记录`:'等待账户数据';
  $('#affiliate-source-label').textContent=sample?'示例记录 · 非真实账户':'未读取真实账户';
 }
 function renderMode(announce=false){
  main.dataset.affiliateState=sample?'sample':'unconnected';
  mode.setAttribute('aria-pressed',String(sample));mode.textContent=sample?'返回未接入状态':'查看示例数据';
  $('#affiliate-notice').querySelector('p').textContent=sample?'示例数据 · 非真实账户。链接、邀请与佣金仅用于展示界面，不会产生邀请或收益。':'未接入账户数据。邀请链接、佣金与记录将在原站登录后显示。';
  $('#affiliate-state').textContent=sample?'示例模式':'未接入';
  link.value=sample?demoLink:'';copy.disabled=!sample;
  $('#affiliate-link-note').textContent=sample?'示例邀请链接 · 仅供复制交互演示，不可用于邀请。':'当前未读取任何账户邀请码。';
  $('#affiliate-code-label').textContent=sample?'示例邀请码：DEMO-ONLY':'邀请码：—';
  $('#affiliate-invite-count').textContent=sample?String(invites.length):'—';
  $('#affiliate-total-commission').textContent=sample?money(sum(commissions)):'—';
  $('#affiliate-available').textContent=sample?money(sum(commissions,row=>row.state==='settled')):'—';
  $('#affiliate-invite-caption').textContent=sample?`对应下方 ${invites.length} 条示例邀请`:'等待账户记录';
  $('#affiliate-total-caption').textContent=sample?'对应下方全部示例佣金':'等待佣金数据';
  $('#affiliate-pending-caption').textContent=sample?`示例待结算：${money(sum(commissions,row=>row.state==='pending'))}`:'结算状态待接入';
  $('#affiliate-record-badge').textContent=sample?'示例数据':'等待账户记录';
  search.disabled=!sample;filter.disabled=!sample;$('#affiliate-reset').disabled=!sample;
  renderRows();
  if(announce)status.textContent=sample?'已显示界面示例。未查询真实账户，也未生成任何邀请或佣金。':'已返回未接入状态，示例链接与记录已清除。';
 }
 function selectTab(next,focus=false){
  tab=next;
  tabs.forEach(button=>{const active=button.dataset.affiliateTab===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();});
  search.value='';setFilterOptions();renderRows();
 }
 mode.addEventListener('click',()=>{sample=!sample;search.value='';filter.value='all';renderMode(true);});
 tabs.forEach((button,index)=>{
  button.addEventListener('click',()=>selectTab(button.dataset.affiliateTab));
  button.addEventListener('keydown',event=>{
   let next;if(event.key==='ArrowRight')next=(index+1)%tabs.length;else if(event.key==='ArrowLeft')next=(index-1+tabs.length)%tabs.length;else if(event.key==='Home')next=0;else if(event.key==='End')next=tabs.length-1;else return;
   event.preventDefault();selectTab(tabs[next].dataset.affiliateTab,true);
  });
 });
 search.addEventListener('input',renderRows);filter.addEventListener('change',renderRows);
 $('#affiliate-reset').addEventListener('click',()=>{search.value='';filter.value='all';renderRows();search.focus();});
 copy.addEventListener('click',async()=>{
  if(!sample)return;
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(demoLink);status.textContent='示例链接已复制。此链接不能用于真实邀请。';}
  catch{link.focus();link.select();status.textContent='无法自动复制，示例链接已选中，请手动复制。';}
 });
 setFilterOptions();renderMode();
})();

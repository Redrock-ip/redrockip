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
 const labels={all:'All statuses',registered:'Registered',linked:'Linked',pending:'Pending settlement',settled:'Settled'};
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
  $('#affiliate-empty-title').textContent=sample?'No matching sample records':'Affiliate records are not connected';
  $('#affiliate-empty-description').textContent=sample?'Try another keyword or reset the filters.':'Sign in on the original site to view your invitation link, eligible referrals and commission details.';
  $('#affiliate-empty-link').hidden=sample;
  $('#affiliate-result-count').textContent=sample?`Showing ${visible.length} of ${rows.length} sample records`:'Waiting for account data';
  $('#affiliate-source-label').textContent=sample?'Sample records · Not a real account':'No real account has been retrieved';
 }
 function renderMode(announce=false){
  main.dataset.affiliateState=sample?'sample':'unconnected';
  mode.setAttribute('aria-pressed',String(sample));mode.textContent=sample?'Return to disconnected state':'Show sample data';
  $('#affiliate-notice').querySelector('p').textContent=sample?'Sample data · Not a real account. The link, referrals and commissions illustrate the interface and do not create invitations or earnings.':'Account data is not connected. Sign in on the original site to view your invitation link, commissions and records.';
  $('#affiliate-state').textContent=sample?'Sample mode':'Disconnected';
  link.value=sample?demoLink:'';copy.disabled=!sample;
  $('#affiliate-link-note').textContent=sample?'Sample invitation link · Demonstrates copying only. It cannot be used for referrals.':'No account invitation code has been retrieved.';
  $('#affiliate-code-label').textContent=sample?'Sample invitation code: DEMO-ONLY':'Invitation code: —';
  $('#affiliate-invite-count').textContent=sample?String(invites.length):'—';
  $('#affiliate-total-commission').textContent=sample?money(sum(commissions)):'—';
  $('#affiliate-available').textContent=sample?money(sum(commissions,row=>row.state==='settled')):'—';
  $('#affiliate-invite-caption').textContent=sample?`Corresponds to the ${invites.length} sample invitations below`:'Waiting for account records';
  $('#affiliate-total-caption').textContent=sample?'Corresponds to all sample commissions below':'Waiting for commission data';
  $('#affiliate-pending-caption').textContent=sample?`Sample pending settlement: ${money(sum(commissions,row=>row.state==='pending'))}`:'Settlement data is not connected';
  $('#affiliate-record-badge').textContent=sample?'Sample data':'Waiting for account records';
  search.disabled=!sample;filter.disabled=!sample;$('#affiliate-reset').disabled=!sample;
  renderRows();
  if(announce)status.textContent=sample?'Interface samples are shown. No real account has been queried and no invitations or commissions have been created.':'Returned to disconnected state. The sample link and records have been cleared.';
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
  try{if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');await navigator.clipboard.writeText(demoLink);status.textContent='Sample link copied. It cannot be used for real referrals.';}
  catch{link.focus();link.select();status.textContent='Could not copy automatically. The sample link is selected for manual copying.';}
 });
 setFilterOptions();renderMode();
})();

 const release = window.RedRockRelease;
 const confirm = $('#purchase-live-confirm');
 const confirmStatus = $('#purchase-live-status');
 const applyPromo = promoForm.querySelector('button');
 const notice = $('#release-status');
 let catalogLoaded = false;
 let appliedQuote = null;
 let reviewedQuote = null;

 function quoteInput() {
  return {productId:selected.product.id,planId:selected.plan?.id,quantity:selected.quantity,promoCode:promoInput.value.trim()};
 }
 function signature(input) { return JSON.stringify(input); }
 function validAppliedQuote() {
  return appliedQuote && appliedQuote.key === signature(quoteInput()) ? appliedQuote.value : null;
 }
 async function getQuote() {
  if (!catalogLoaded || !selected.plan) throw new Error('Catalog not loaded');
  const request = quoteInput();
  const key = signature(request);
  const result = await release.call('quotePurchase',request);
  if (key !== signature(quoteInput()) || pending) return null;
  if (typeof result?.quoteId !== 'string' || !result.quoteId ||
      ![result.totalCents,result.discountCents].every(value => Number.isSafeInteger(value) && value >= 0) ||
      !Number.isSafeInteger(result.totalCents + result.discountCents)) throw new Error('Invalid quote');
  appliedQuote = {key,value:result};
  renderTotals();
  return result;
 }
 function renderTotals() {
  const reference = selected.plan ? Math.round(selected.plan.total * 100) * selected.quantity : null;
  const current = validAppliedQuote();
  const total = current?.totalCents ?? reference;
  $('#purchase-summary-total').textContent = total === null ? '—' : money(total/100);
  $('#purchase-promo-breakdown').hidden = !current?.discountCents;
  if (current) {
   $('#purchase-promo-subtotal').textContent = money((current.totalCents + current.discountCents)/100);
   $('#purchase-promo-discount').textContent = '−' + money(current.discountCents/100);
  }
 }
 function restorePromo() {
  appliedQuote = null;
  promoInput.value = '';
  release.status(promoStatus,'');
 }
 promoForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (!promoInput.value.trim()) { promoInput.focus(); return; }
  if (applying || applyPromo.disabled) return;
  applying = true;
  await release.action(applyPromo,promoStatus,async () => {
   const result = await getQuote();
   if (result) release.status(promoStatus,result.discountCents
    ? release.t('优惠已计入报价。','Discount included in the quote.')
    : release.t('已更新报价。','Quote updated.'));
  });
  applying = false;
  refreshActions();
 });
 promoInput.addEventListener('input', () => {
  appliedQuote = null;
  release.status(promoStatus,'');
  renderTotals();
 });
 function refreshActions() {
  const quoting = catalogLoaded && !layout.inert && Boolean(selected.plan) && release.has('quotePurchase');
  preview.disabled = !quoting || !release.has('createOrder') || reviewing;
  applyPromo.disabled = !quoting || applying;
  promoInput.disabled = !quoting;
 }
 let reviewing = false;
 let applying = false;

 async function loadCurrentCatalog() {
  if (!release.has('loadPurchaseCatalog')) return;
  try {
   const result = await release.call('loadPurchaseCatalog',{});
   if (!Array.isArray(result?.products)) throw new Error('Invalid catalog');
   const byId = new Map(result.products.map(product => [product.id,product]));
   const updated = products.map(product => {
    const current = byId.get(product.id);
    if (!Array.isArray(current?.plans)) throw new Error('Missing product');
    const ids = new Set();
    for (const plan of current.plans) {
     if (!/^[a-z0-9_-]+$/i.test(plan.id) || typeof plan.id !== 'string' || ids.has(plan.id) ||
         !['label','quantity','duration','areaKey','area','unit'].every(key => typeof plan[key] === 'string') ||
         !Number.isSafeInteger(plan.durationOrder) || plan.durationOrder < 0 ||
         !Number.isFinite(plan.total) || plan.total < 0 || typeof plan.soldOut !== 'boolean') throw new Error('Invalid plan');
     ids.add(plan.id);
    }
    return {...product,plans:current.plans,starting:current.starting};
   });
   animation?.cancel(); animation = null; pending = null; setSwitching(false);
   products = updated;
   catalogLoaded = true;
   selected = readSelection(window.location.search);
   const about = $('#purchase-availability');
   about.textContent = release.t('以确认订单时的报价与库存为准。','Price and availability are confirmed when you review your order.');
   $('#purchase-catalog-title').textContent = release.t('可选套餐','Available plans');
   render();
   release.status(notice, release.has('quotePurchase') && release.has('createOrder') ? '' : release.pending);
  } catch {
   release.status(notice,release.pending);
  }
 }

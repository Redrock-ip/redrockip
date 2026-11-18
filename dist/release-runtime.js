(() => {
  'use strict';
  const backend = window.RedRockBackend || {};
  const english = document.documentElement.lang.startsWith('en');
  const t = (zh,en) => english ? en : zh;
  const context = { language:english ? 'en' : 'zh-CN', path:window.location.pathname };
  const $ = id => document.getElementById(id);
  const has = method => typeof backend[method] === 'function';
  const pending = t('服务暂不可用，请稍后再试。','This service is temporarily unavailable.');
  const failed = t('未能完成操作，请稍后再试。','The request could not be completed. Try again shortly.');
  function status(node, text) {
    if (!node) return;
    node.textContent = text;
    node.hidden = !text;
  }
  async function call(method, data) {
    if (!has(method)) throw new Error('Service unavailable');
    return backend[method](data,context);
  }
  function redirect(value, fallback) {
    const destination = new URL(value || fallback,window.location.origin);
    const allowed = destination.origin === window.location.origin ||
      (destination.protocol === 'https:' && backend.allowedRedirectOrigins?.includes(destination.origin));
    if (!allowed || !['http:', 'https:'].includes(destination.protocol)
        || destination.username || destination.password) throw new Error('Unapproved redirect');
    window.location.assign(destination.href);
  }
  async function action(button, output, operation) {
    if (button.disabled) return;
    button.disabled = true;
    status(output,'');
    try { return await operation(); }
    catch { status(output,failed); }
    finally { button.disabled = false; }
  }
  const local = path => (english ? '/en' : '') + path;
  window.RedRockRelease = {has,call,status,redirect,action,t,local,pending,failed};

  const login = $('login-form');
  if (login) {
    const email = $('auth-email'), password = $('auth-password'), submit = $('login-submit');
    const google = $('google-signin'), output = $('form-status');
    const connected = has('login');
    const remember = $('remember-email'), toggle = $('password-toggle'), caps = $('caps-warning');
    const rememberKey = 'redrock_remember_email';
    const writeRemembered = value => {
      try {
        if (value) localStorage.setItem(rememberKey,value);
        else localStorage.removeItem(rememberKey);
      } catch { /* Storage may be disabled. */ }
    };
    if (connected) {
      try {
        const savedEmail = localStorage.getItem(rememberKey);
        if (savedEmail) { email.value = savedEmail; remember.checked = true; }
      } catch { /* The login form still works. */ }
    }
    remember.addEventListener('change',() => { if (!remember.checked) writeRemembered(''); });
    for (const control of [email,password,submit,remember,toggle]) control.disabled = !connected;
    google.disabled = !has('startGoogleLogin');
    toggle.addEventListener('click', () => {
      const show = password.type === 'password';
      password.type = show ? 'text' : 'password';
      toggle.setAttribute('aria-pressed',String(show));
      toggle.setAttribute('aria-label',show ? t('隐藏密码','Hide password') : t('显示密码','Show password'));
    });
    for (const event of ['keydown','keyup']) {
      password.addEventListener(event,e => { caps.hidden = !e.getModifierState('CapsLock'); });
    }
    password.addEventListener('blur',() => { caps.hidden = true; });
    login.addEventListener('submit',event => {
      event.preventDefault();
      if (!connected || !login.reportValidity()) return;
      action(submit,output,async () => {
        const address = email.value.trim();
        const result = await call('login',{email:address,password:password.value,remember:remember.checked});
        password.value = '';
        if (!result || result.ok === false) throw new Error('Sign-in failed');
        writeRemembered(remember.checked ? address : '');
        redirect(result.redirect,local('/dashboard'));
      });
    });
    google.addEventListener('click',() => action(google,output,async () => {
      const result = await call('startGoogleLogin',{});
      if (!result?.redirect) throw new Error('Missing sign-in URL');
      redirect(result.redirect);
    }));
    if (connected || !google.disabled) $('preview-notice').hidden = true;
  }

  const recharge = $('recharge-form');
  if (recharge) {
    const amount = $('recharge-amount'), submit = $('recharge-preview');
    const dialog = $('recharge-review-dialog'), confirm = $('recharge-live-confirm');
    const info = $('recharge-demo-status');
    submit.disabled = !has('createRecharge');
    if (!submit.disabled) status($('release-status'),'');
    function refreshAmount() {
      const number = Number(amount.value);
      $('recharge-summary-amount').textContent = number > 0 ? '$'+number.toFixed(2) : '—';
      for (const preset of recharge.querySelectorAll('[data-recharge-amount]')) {
        preset.setAttribute('aria-pressed',String(number===Number(preset.dataset.rechargeAmount)));
      }
    }
    for (const preset of recharge.querySelectorAll('[data-recharge-amount]')) {
      preset.addEventListener('click',() => {amount.value=preset.dataset.rechargeAmount;refreshAmount();});
    }
    amount.addEventListener('input',refreshAmount);
    function method() { return recharge.querySelector('input[name="recharge-method"]:checked')?.value || 'online'; }
    function methodLabel() { return method() === 'crypto' ? 'USDT (TRC-20)' : t('在线支付','Online payment'); }
    const showMethod = () => {
      $('recharge-summary-method').textContent = methodLabel();
      $('recharge-network-row').hidden = method() !== 'crypto';
    };
    for (const field of recharge.querySelectorAll('input[name="recharge-method"]')) field.addEventListener('change',showMethod);
    let review = null;
    recharge.addEventListener('submit',event => {
      event.preventDefault();
      if (submit.disabled || !recharge.reportValidity()) return;
      const number = Number(amount.value);
      const cents = Math.round(number * 100);
      if (!Number.isSafeInteger(cents) || cents < 1000 || cents > 200000 ||
          Math.abs(number*100-cents)>0.000001) {
        status($('recharge-error'),t('请输入 $10 至 $2,000 的金额，最多两位小数。','Enter an amount from $10 to $2,000 with at most two decimal places.'));
        return;
      }
      status($('recharge-error'),'');
      review = {amountCents:cents,paymentMethod:method()};
      $('recharge-review-amount').textContent = '$'+number.toFixed(2);
      $('recharge-review-method').textContent = methodLabel();
      $('recharge-review-network-row').hidden = method() !== 'crypto';
      status(info,'');
      if (!dialog.open) dialog.showModal();
    });
    for (const id of ['recharge-review-close','recharge-review-edit']) $(id).addEventListener('click',() => dialog.close());
    confirm.addEventListener('click',() => action(confirm,info,async () => {
      if (!review) throw new Error('No reviewed amount');
      const result = await call('createRecharge',review);
      if (!result?.redirect) throw new Error('Missing payment URL');
      review = null;
      redirect(result.redirect);
    }));
  }

  const service = $('service-form');
  if (service) {
    const submit = service.querySelector('button');
    const main = document.querySelector('[data-workspace-page="service"]');
    const output = $('service-status');
    submit.disabled = !has('requestService');
    if (!submit.disabled) status($('release-status'),'');
    service.addEventListener('submit',event => {
      event.preventDefault();
      action(submit,output,async () => {
        const fields = {};
        for (const field of service.querySelectorAll('input,select')) {
          if (!field.disabled && !field.closest('[hidden]')) fields[field.id.replace(/^service-/,'')] = field.value;
        }
        const response = await call('requestService',{productId:main.dataset.serviceProduct,mode:main.dataset.serviceMode,fields});
        if (typeof response?.connection !== 'string') throw new Error('No connection information');
        $('service-sample').value = response.connection;
        const details = (Array.isArray(response.details) ? response.details : []).map(item => {
          const row = document.createElement('div');
          const label = document.createElement('dt'), value = document.createElement('dd');
          label.textContent = item.label; value.textContent = item.value;
          row.append(label,value); return row;
        });
        $('service-details').replaceChildren(...details);
        $('service-empty').hidden = true;
        $('service-result').hidden = false;
      });
    });
    $('service-copy').addEventListener('click',async () => {
      const field = $('service-sample');
      try { await navigator.clipboard.writeText(field.value); }
      catch { field.focus(); field.select(); }
    });
  }

  const rates = [...document.querySelectorAll('[data-release-rate]')];
  if (rates.length && has('loadStartingPrices')) {
    call('loadStartingPrices',{}).then(result => {
      const prices = result?.prices || {};
      if (!rates.every(element => {
        const price = prices[element.dataset.releaseRate];
        return typeof price === 'string' && price.trim();
      })) return;
      for (const element of rates) element.textContent = prices[element.dataset.releaseRate];
      for (const note of document.querySelectorAll('[data-release-rate-note]')) {
        note.textContent = t('当前起价','Current starting prices');
      }
    }).catch(() => { /* Leave the labeled reference data in view. */ });
  }

  const main = document.querySelector('#main');
  if (has('mountPage') && main) {
    Promise.resolve().then(() => backend.mountPage({...context,main,tools:window.RedRockRelease})).catch(() => {
      status($('release-status'),failed);
    });
  }
})();

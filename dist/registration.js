(() => {
  'use strict';

  function init() {
    const $ = id => document.getElementById(id);
    const form = $('register-form');
    if (!form) return;
    const release = window.RedRockRelease;
    const preview = release ? null : window.RedRockRegistrationPreview;
    const apiReady = ['getRegistrationCaptcha','sendRegistrationCode','registerAccount'].every(name => release?.has(name));
    const call = apiReady ? (name,input) => release.call(name,input) : (name,input) => preview[name](input);
    const status = $('register-status');

    function message(value) {
      status.textContent = value;
      status.hidden = !value;
    }

    if (!apiReady && !preview) {
      message('注册服务暂不可用，请稍后再试或联系支持。');
      return;
    }

    const email = $('register-email');
    const captcha = $('register-captcha');
    const image = $('register-captcha-image');
    const sample = $('register-captcha-sample');
    const send = $('register-send');
    const refresh = $('register-refresh');
    const code = $('register-code');
    const password = $('register-password');
    const repeated = $('register-repeat-password');
    const invite = $('register-invite');
    const terms = $('register-terms');
    const submit = $('register-submit');
    const back = $('register-back');
    const sendLabel = send.textContent;
    const toggles = [...form.querySelectorAll('[data-register-password]')];
    let loading = false;
    let busy = false;
    let challengeId = '';
    let requestedEmail = '';
    let sendAgainAt = 0;
    let countdown;

    $('register-preview-note').hidden = !preview;
    invite.value = (new URLSearchParams(location.search).get('invitecode') || '').slice(0,128);
    captcha.required = false;
    const address = () => email.value.trim();

    function updateControls() {
      const remaining = Math.max(0,Math.ceil((sendAgainAt-Date.now())/1000));
      send.textContent = remaining ? `${sendLabel} (${remaining}s)` : sendLabel;
      for (const field of [email,code,password,repeated,invite,terms,...toggles]) field.disabled = busy;
      captcha.disabled = busy || loading || !challengeId;
      refresh.disabled = busy || loading;
      send.disabled = captcha.disabled || remaining > 0 || !address();
      submit.disabled = busy || !requestedEmail || address() !== requestedEmail;
    }

    async function loadChallenge() {
      if (loading || busy) return;
      loading = true;
      challengeId = '';
      captcha.value = '';
      updateControls();
      try {
        challengeId = await window.RedRockAccountChallenge.load({
          read:() => call('getRegistrationCaptcha',{}),image,sample,preview
        });
      } catch {
        message('图形验证码加载失败，请点击换一张。');
      } finally {
        loading = false;
        updateControls();
      }
    }

    send.addEventListener('click',async () => {
      if (send.disabled || !email.reportValidity()) return;
      if (!captcha.value.trim()) {
        message('请输入图形验证码。');
        captcha.focus();
        return;
      }
      const destination = address();
      busy = true;
      updateControls();
      message('正在提交邮件验证码请求…');
      let sent = false;
      try {
        const result = await call('sendRegistrationCode',{email:destination,challengeId,captcha:captcha.value.trim()});
        if (result?.ok !== true) throw new Error('Registration code was not sent');
        requestedEmail = destination;
        code.value = '';
        const delay = Number.isFinite(result.retryAfterSeconds) ? result.retryAfterSeconds : 60;
        sendAgainAt = Date.now()+1000*Math.max(preview ? 0 : 60,delay);
        clearInterval(countdown);
        countdown = setInterval(() => {
          updateControls();
          if (Date.now() >= sendAgainAt) clearInterval(countdown);
        },250);
        message(preview ? result.notice : '验证码请求已受理，请查收邮件。');
        sent = true;
      } catch {
        message('未能发送验证码。请检查图形验证码后重试。');
      } finally {
        busy = false;
        loadChallenge();
        if (sent) code.focus();
      }
    });

    form.addEventListener('submit',async event => {
      event.preventDefault();
      if (submit.disabled) return;
      repeated.setCustomValidity(password.value === repeated.value ? '' : '两次密码输入不一致。');
      if (!form.reportValidity()) return;
      busy = true;
      updateControls();
      message('正在创建账户…');
      try {
        const result = await call('registerAccount',{
          email:requestedEmail,code:code.value.trim(),password:password.value,
          inviteCode:invite.value.trim() || undefined,termsAccepted:terms.checked
        });
        if (result?.ok !== true) throw new Error('Registration failed');
        for (const field of [password,repeated,code,captcha]) field.value = '';
        requestedEmail = '';
        form.hidden = true;
        clearInterval(countdown);
        $('register-intro').hidden = true;
        $('register-title').textContent = '注册完成';
        message(preview ? result.notice : '账户已创建，你可以返回登录。');
        back.focus();
        if (apiReady && result.redirect) {
          try { release.redirect(result.redirect); } catch { /* The login link remains available. */ }
        }
      } catch {
        message('未能创建账户。请确认邮件验证码和账户信息后重试。');
      } finally {
        busy = false;
        updateControls();
      }
    });

    refresh.addEventListener('click',() => {message('');loadChallenge();});
    email.addEventListener('input',() => {
      if (address() !== requestedEmail) {
        requestedEmail = '';
        code.value = '';
      }
      updateControls();
    });
    for (const button of toggles) button.addEventListener('click',() => {
      const field = $(button.dataset.registerPassword);
      const visible = field.type === 'password';
      field.type = visible ? 'text' : 'password';
      button.textContent = visible ? '隐藏' : '显示';
      button.setAttribute('aria-pressed',String(visible));
    });
    for (const field of [password,repeated]) field.addEventListener('input',() => repeated.setCustomValidity(''));
    loadChallenge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

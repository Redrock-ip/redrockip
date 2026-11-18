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
      message('Registration is unavailable. Try again later or contact support.');
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
        message('The image could not load. Request a new image.');
      } finally {
        loading = false;
        updateControls();
      }
    }

    send.addEventListener('click',async () => {
      if (send.disabled || !email.reportValidity()) return;
      if (!captcha.value.trim()) {
        message('Enter the image verification code.');
        captcha.focus();
        return;
      }
      const destination = address();
      busy = true;
      updateControls();
      message('Requesting an email verification code…');
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
        message(preview ? result.notice : 'Code requested. Check your inbox.');
        sent = true;
      } catch {
        message('Could not request a code. Check the image code and try again.');
      } finally {
        busy = false;
        loadChallenge();
        if (sent) code.focus();
      }
    });

    form.addEventListener('submit',async event => {
      event.preventDefault();
      if (submit.disabled) return;
      repeated.setCustomValidity(password.value === repeated.value ? '' : 'The passwords do not match.');
      if (!form.reportValidity()) return;
      busy = true;
      updateControls();
      message('Creating your account…');
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
        $('register-title').textContent = 'Registration complete';
        message(preview ? result.notice : 'Your account is ready. Return to sign in.');
        back.focus();
        if (apiReady && result.redirect) {
          try { release.redirect(result.redirect); } catch { /* The login link remains available. */ }
        }
      } catch {
        message('Could not create the account. Check your email code and account details, then try again.');
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
      button.textContent = visible ? 'Hide' : 'Show';
      button.setAttribute('aria-pressed',String(visible));
    });
    for (const field of [password,repeated]) field.addEventListener('input',() => repeated.setCustomValidity(''));
    loadChallenge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

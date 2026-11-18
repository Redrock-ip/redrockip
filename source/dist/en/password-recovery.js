(() => {
  'use strict';

  function init() {
    const $ = id => document.getElementById(id);
    const requestForm = $('recovery-email-form');
    if (!requestForm) return;
    const resetForm = $('recovery-reset-form');
    const release = window.RedRockRelease;
    const preview = release ? null : window.RedRockRecoveryPreview;
    const connected = ['getRecoveryCaptcha','sendRecoveryCode','resetPassword'].every(name => release?.has(name));
    const invoke = connected ? (name,payload) => release.call(name,payload) : (name,payload) => preview[name](payload);
    const email = $('recovery-email');
    const captcha = $('recovery-captcha');
    const captchaImage = $('recovery-captcha-image');
    const sample = $('recovery-captcha-sample');
    const send = $('recovery-send');
    const refresh = $('recovery-refresh');
    const resend = $('recovery-resend');
    const code = $('recovery-email-code');
    const password = $('recovery-new-password');
    const repeated = $('recovery-repeat-password');
    const submit = $('recovery-submit');
    const cancelResend = $('recovery-cancel-resend');
    const status = $('recovery-status');
    const intro = $('recovery-intro');
    const initialCopy = intro.textContent;
    const resendCopy = resend.textContent;
    const back = $('recovery-back');
    const visibilityButtons = [...resetForm.querySelectorAll('[data-recovery-password]')];
    let verifying = false;
    let inFlight = false;
    let imageLoading = false;
    let challengeId = '';
    let recoveryEmail = '';
    let nextSendAt = 0;
    let timer;

    function showStatus(message) {
      status.textContent = message;
      status.hidden = !message;
    }

    if (!connected && !preview) {
      showStatus('Password recovery is unavailable. Try again later or contact support.');
      return;
    }

    $('recovery-preview-note').hidden = !preview;

    function updateControls() {
      const seconds = Math.max(0,Math.ceil((nextSendAt - Date.now())/1000));
      resend.textContent = seconds ? `${resendCopy} (${seconds}s)` : resendCopy;
      resend.disabled = inFlight || seconds > 0;
      email.disabled = inFlight;
      captcha.disabled = inFlight || imageLoading || !challengeId;
      refresh.disabled = inFlight || imageLoading;
      send.disabled = captcha.disabled;
      for (const input of [code,password,repeated,submit,cancelResend,$('recovery-change-email'),...visibilityButtons]) {
        input.disabled = inFlight;
      }
    }

    function startCooldown(seconds) {
      nextSendAt = Date.now() + seconds*1000;
      clearInterval(timer);
      updateControls();
      timer = setInterval(() => {
        updateControls();
        if (Date.now() >= nextSendAt) clearInterval(timer);
      },250);
    }

    async function loadChallenge() {
      if (imageLoading || inFlight) return;
      imageLoading = true;
      challengeId = '';
      captcha.value = '';
      updateControls();
      try {
        challengeId = await window.RedRockAccountChallenge.load({
          read:() => invoke('getRecoveryCaptcha',{}),image:captchaImage,sample,preview
        });
      } catch {
        showStatus('The image could not load. Request a new image.');
      } finally {
        imageLoading = false;
        updateControls();
      }
    }

    function setStep(reset) {
      verifying = reset;
      requestForm.hidden = reset;
      resetForm.hidden = !reset;
      const current = $(reset ? 'recovery-reset-indicator' : 'recovery-email-indicator');
      const other = $(reset ? 'recovery-email-indicator' : 'recovery-reset-indicator');
      current.setAttribute('aria-current','step');
      other.removeAttribute('aria-current');
      intro.textContent = reset ? 'Enter the code from your email and choose a new password.' : initialCopy;
      updateControls();
      (reset ? code : email).focus();
    }

    function clearPasswords() {
      for (const button of visibilityButtons) {
        const field = $(button.dataset.recoveryPassword);
        field.value = '';
        field.type = 'password';
        button.textContent = 'Show';
        button.setAttribute('aria-pressed','false');
      }
      repeated.setCustomValidity('');
    }

    requestForm.addEventListener('submit',async event => {
      event.preventDefault();
      if (send.disabled || verifying || !requestForm.reportValidity()) return;
      const destination = email.value.trim();
      if (destination === recoveryEmail && Date.now() < nextSendAt) {
        showStatus('Wait a moment before requesting another code.');
        return;
      }
      inFlight = true;
      updateControls();
      showStatus('Requesting an email verification code…');
      try {
        const result = await invoke('sendRecoveryCode',{email:destination,challengeId,captcha:captcha.value.trim()});
        if (result?.ok !== true) throw new Error('Could not request code');
        recoveryEmail = destination;
        $('recovery-destination').textContent = destination;
        code.value = '';
        clearPasswords();
        startCooldown(Math.max(preview ? 0 : 60,Number.isFinite(result.retryAfterSeconds) ? result.retryAfterSeconds : 60));
        setStep(true);
        showStatus(preview ? result.notice : 'If this email is linked to an active account, you will receive a verification code.');
      } catch {
        showStatus('Could not request a code. Check the image code and try again.');
      } finally {
        inFlight = false;
        updateControls();
        if (verifying) code.focus();
        else loadChallenge();
      }
    });

    resetForm.addEventListener('submit',async event => {
      event.preventDefault();
      if (inFlight || !verifying) return;
      repeated.setCustomValidity(password.value === repeated.value ? '' : 'The passwords do not match.');
      if (!resetForm.reportValidity()) return;
      inFlight = true;
      updateControls();
      showStatus('Updating your password…');
      try {
        const result = await invoke('resetPassword',{email:recoveryEmail,code:code.value.trim(),newPassword:password.value});
        if (result?.ok !== true) throw new Error('Could not reset password');
        clearPasswords();
        code.value = '';
        email.value = '';
        recoveryEmail = '';
        captcha.value = '';
        resetForm.hidden = true;
        document.querySelector('.recovery-steps').hidden = true;
        intro.hidden = true;
        $('recovery-title').textContent = 'Password reset complete';
        showStatus(preview ? result.notice : 'Return to sign in with your new password.');
        clearInterval(timer);
        back.focus();
      } catch {
        showStatus('Could not reset the password. Check the email code and try again.');
      } finally {
        inFlight = false;
        updateControls();
      }
    });

    refresh.addEventListener('click', () => {
      showStatus('');
      loadChallenge();
    });
    resend.addEventListener('click',() => {
      showStatus('');
      cancelResend.hidden = false;
      email.value = recoveryEmail;
      setStep(false);
      loadChallenge();
    });
    cancelResend.addEventListener('click',() => {showStatus(''); setStep(true);});
    $('recovery-change-email').addEventListener('click',() => {
      showStatus('');
      cancelResend.hidden = true;
      code.value = '';
      clearPasswords();
      setStep(false);
      email.select();
      loadChallenge();
    });
    for (const button of visibilityButtons) {
      button.addEventListener('click',() => {
        const field = $(button.dataset.recoveryPassword);
        const visible = field.type === 'password';
        field.type = visible ? 'text' : 'password';
        button.textContent = visible ? 'Hide' : 'Show';
        button.setAttribute('aria-pressed',String(visible));
      });
    }
    for (const field of [password,repeated]) field.addEventListener('input',() => repeated.setCustomValidity(''));
    loadChallenge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

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
      showStatus('密码找回服务暂不可用，请稍后再试或联系支持。');
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
        showStatus('图形验证码加载失败，请点击换一张。');
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
      intro.textContent = reset ? '输入邮件验证码并设置新密码。' : initialCopy;
      updateControls();
      (reset ? code : email).focus();
    }

    function clearPasswords() {
      for (const button of visibilityButtons) {
        const field = $(button.dataset.recoveryPassword);
        field.value = '';
        field.type = 'password';
        button.textContent = '显示';
        button.setAttribute('aria-pressed','false');
      }
      repeated.setCustomValidity('');
    }

    requestForm.addEventListener('submit',async event => {
      event.preventDefault();
      if (send.disabled || verifying || !requestForm.reportValidity()) return;
      const destination = email.value.trim();
      if (destination === recoveryEmail && Date.now() < nextSendAt) {
        showStatus('发送间隔未结束，请稍后再试。');
        return;
      }
      inFlight = true;
      updateControls();
      showStatus('正在提交邮件验证码请求…');
      try {
        const result = await invoke('sendRecoveryCode',{email:destination,challengeId,captcha:captcha.value.trim()});
        if (result?.ok !== true) throw new Error('Could not request code');
        recoveryEmail = destination;
        $('recovery-destination').textContent = destination;
        code.value = '';
        clearPasswords();
        startCooldown(Math.max(preview ? 0 : 60,Number.isFinite(result.retryAfterSeconds) ? result.retryAfterSeconds : 60));
        setStep(true);
        showStatus(preview ? result.notice : '如果该邮箱关联有效账户，你将收到验证码。');
      } catch {
        showStatus('未能发送验证码。请检查图形验证码后重试。');
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
      repeated.setCustomValidity(password.value === repeated.value ? '' : '两次密码输入不一致。');
      if (!resetForm.reportValidity()) return;
      inFlight = true;
      updateControls();
      showStatus('正在更新密码…');
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
        $('recovery-title').textContent = '密码重置完成';
        showStatus(preview ? result.notice : '请使用新密码返回登录。');
        clearInterval(timer);
        back.focus();
      } catch {
        showStatus('未能重置密码。请核对邮件验证码后重试。');
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
        button.textContent = visible ? '隐藏' : '显示';
        button.setAttribute('aria-pressed',String(visible));
      });
    }
    for (const field of [password,repeated]) field.addEventListener('input',() => repeated.setCustomValidity(''));
    loadChallenge();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();

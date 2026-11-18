(() => {
  'use strict';
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-control');
  const motionLabel = document.querySelector('#motion-label');
  const motionIcon = document.querySelector('.motion-icon');
  let storedMotion;
  try { storedMotion = localStorage.getItem('redrock-motion'); } catch { /* Session-only preference. */ }
  let motionEnabled = storedMotion ? storedMotion === 'on' : !reducedMotion.matches;
  function applyMotion() {
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    motionButton.setAttribute('aria-pressed', String(motionEnabled));
    motionButton.setAttribute('aria-label', motionEnabled ? '暂停页面动态效果' : '开启页面动态效果');
    motionLabel.textContent = motionEnabled ? '暂停动效' : '开启动效';
    motionIcon.textContent = motionEnabled ? 'Ⅱ' : '▷';
  }
  applyMotion();
  motionButton.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    storedMotion = motionEnabled ? 'on' : 'off';
    try { localStorage.setItem('redrock-motion', storedMotion); } catch { /* Keep preference in memory. */ }
    applyMotion();
  });
  reducedMotion.addEventListener('change', () => {
    if (storedMotion === null || storedMotion === undefined) {
      motionEnabled = !reducedMotion.matches;
      applyMotion();
    }
  });

  const form = document.querySelector('#login-form');
  if (!form) return;
  const email = document.querySelector('#auth-email');
  const password = document.querySelector('#auth-password');
  const remember = document.querySelector('#remember-email');
  const toggle = document.querySelector('#password-toggle');
  const emailError = document.querySelector('#email-error');
  const passwordError = document.querySelector('#password-error');
  const status = document.querySelector('#form-status');
  const caps = document.querySelector('#caps-warning');
  try {
    const remembered = localStorage.getItem('redrock_remember_email');
    if (remembered) { email.value = remembered; remember.checked = true; }
  } catch { /* The preview works when storage is blocked. */ }
  function clearError(input, error) {
    input.removeAttribute('aria-invalid');
    error.textContent = '';
    error.hidden = true;
  }
  function setError(input, error, message) {
    input.setAttribute('aria-invalid', 'true');
    error.textContent = message;
    error.hidden = false;
  }
  function showStatus(message) {
    status.textContent = message;
    status.hidden = false;
  }
  email.addEventListener('input', () => { clearError(email, emailError); status.hidden = true; });
  password.addEventListener('input', () => { clearError(password, passwordError); status.hidden = true; });
  toggle.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    toggle.setAttribute('aria-label', visible ? '隐藏密码' : '显示密码');
    toggle.setAttribute('aria-pressed', String(visible));
  });
  ['keydown', 'keyup'].forEach(eventName => password.addEventListener(eventName, event => {
    caps.hidden = !(event.getModifierState && event.getModifierState('CapsLock'));
  }));
  password.addEventListener('blur', () => { caps.hidden = true; });
  remember.addEventListener('change', () => {
    if (!remember.checked) {
      try { localStorage.removeItem('redrock_remember_email'); } catch { /* No stored data to clear. */ }
    }
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearError(email, emailError);
    clearError(password, passwordError);
    status.hidden = true;
    let invalid = null;
    if (!email.value.trim()) {
      setError(email, emailError, '请输入邮箱地址');
      invalid = email;
    } else if (email.validity.typeMismatch) {
      setError(email, emailError, '请输入有效的邮箱地址');
      invalid = email;
    }
    if (!password.value) {
      setError(password, passwordError, '请输入演示密码');
      invalid ||= password;
    }
    if (invalid) { invalid.focus(); return; }
    // This is an isolated design preview. No credentials are submitted or logged.
    // Remember only the email after the visitor explicitly checks the box.
    try {
      if (remember.checked) localStorage.setItem('redrock_remember_email', email.value.trim());
      else localStorage.removeItem('redrock_remember_email');
    } catch { /* Validation remains available without storage. */ }
    showStatus('预览验证完成。此页面未连接登录服务，请通过下方“前往原站登录”使用现有账户。');
  });
  document.querySelector('#google-signin').addEventListener('click', () => {
    showStatus('Google 登录请在原站完成，可使用下方“前往原站登录”链接。');
  });
  document.querySelector('#login-submit').disabled = false;
})();

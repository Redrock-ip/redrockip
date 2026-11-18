(() => {
  'use strict';
  const main = document.querySelector('main[data-page]');
  if (!main) return;

  if (main.dataset.page === 'faq') {
    const input = document.querySelector('#faq-search');
    const clear = document.querySelector('#faq-clear');
    const buttons = [...document.querySelectorAll('[data-faq-category]')];
    const items = [...document.querySelectorAll('[data-faq-item]')];
    const groups = [...document.querySelectorAll('[data-faq-group]')];
    const empty = document.querySelector('#faq-empty');
    const results = document.querySelector('#faq-results');
    const status = document.querySelector('#faq-count');
    let category = 'all';
    const normalize = value => value.normalize('NFKC').toLocaleLowerCase().trim();
    const searchable = new Map(items.map(item => [item, normalize(item.textContent)]));

    function render() {
      const terms = normalize(input.value).split(/\s+/u).filter(Boolean);
      let visible = 0;
      items.forEach(item => {
        const matchesCategory = category === 'all' || item.dataset.category === category;
        const matchesQuery = terms.every(term => searchable.get(item).includes(term));
        item.hidden = !(matchesCategory && matchesQuery);
        if (!item.hidden) visible += 1;
      });
      groups.forEach(group => {
        group.hidden = ![...group.querySelectorAll('[data-faq-item]')].some(item => !item.hidden);
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.faqCategory === category)));
      clear.hidden = input.value.length === 0;
      empty.hidden = visible > 0;
      status.textContent = terms.length || category !== 'all' ? `找到 ${visible} 条匹配的问题。` : `共 ${items.length} 条常见问题。`;
      results.setAttribute('data-result-count', String(visible));
    }
    input.addEventListener('input', render);
    input.addEventListener('search', render);
    clear.addEventListener('click', () => {
      input.value = '';
      render();
      input.focus();
    });
    buttons.forEach(button => button.addEventListener('click', () => {
      category = button.dataset.faqCategory;
      render();
    }));
    document.querySelector('#faq-reset').addEventListener('click', () => {
      category = 'all';
      input.value = '';
      render();
      input.focus();
    });
    render();
  }

  if (main.dataset.page === 'contact') {
    const email = 'support@redrock-ip.com';
    const emailStatus = document.querySelector('#contact-copy-status');
    const copyEmail = document.querySelector('[data-company-copy-email]');
    copyEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        emailStatus.textContent = '邮箱已复制。';
      } catch {
        emailStatus.textContent = `请手动复制：${email}`;
      }
    });

    const form = document.querySelector('#company-contact-form');
    const review = document.querySelector('#contact-review');
    const formStatus = document.querySelector('#contact-form-status');
    const draftStatus = document.querySelector('#contact-draft-status');
    const openDraft = document.querySelector('#contact-open-draft');
    const copyDraft = document.querySelector('#contact-copy-draft');
    const manualCopy = document.querySelector('#contact-manual-copy');
    const title = document.querySelector('#contact-review-title');
    const fields = {
      name: document.querySelector('#contact-name'),
      email: document.querySelector('#contact-email'),
      topic: document.querySelector('#contact-topic'),
      product: document.querySelector('#contact-product'),
      subject: document.querySelector('#contact-subject'),
      message: document.querySelector('#contact-message')
    };
    let draftText = '';
    let draftReady = false;

    function invalidateDraft() {
      Object.values(fields).forEach(field => field.setCustomValidity(''));
      if (!draftReady) return;
      draftReady = false;
      openDraft.removeAttribute('href');
      openDraft.setAttribute('aria-disabled', 'true');
      copyDraft.disabled = true;
      manualCopy.hidden = true;
      draftStatus.textContent = '内容已修改，请重新点击“预览邮件草稿”更新。';
      formStatus.textContent = '草稿需要重新生成后才能打开。';
    }
    form.addEventListener('input', invalidateDraft);
    form.addEventListener('change', invalidateDraft);
    form.addEventListener('submit', event => {
      event.preventDefault();
      Object.values(fields).forEach(field => field.setCustomValidity(''));
      if (!fields.name.value.trim()) fields.name.setCustomValidity('请填写称呼。');
      if (fields.subject.value.trim().length < 2) fields.subject.setCustomValidity('请填写至少 2 字的主题。');
      if (fields.message.value.trim().length < 10) fields.message.setCustomValidity('请填写至少 10 字的具体需求。');
      if (!form.reportValidity()) return;
      const subject = `[REDROCK 咨询] ${fields.subject.value.trim()}`;
      const body = [
        '您好，REDROCK 团队：', '',
        `称呼：${fields.name.value.trim()}`,
        `回复邮箱：${fields.email.value.trim()}`,
        `咨询类型：${fields.topic.value}`,
        `相关产品：${fields.product.value}`,
        '', '具体需求：', fields.message.value.trim()
      ].join('\n');
      document.querySelector('#contact-draft-subject').textContent = subject;
      document.querySelector('#contact-draft-body').textContent = body;
      draftText = `收件人：${email}\n主题：${subject}\n\n${body}`;
      openDraft.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      openDraft.setAttribute('aria-disabled', 'false');
      copyDraft.disabled = false;
      draftReady = true;
      review.hidden = false;
      manualCopy.hidden = true;
      formStatus.textContent = '草稿已生成，请在下方检查。尚未发送邮件。';
      draftStatus.textContent = '草稿不会自动发送。请在邮件应用中检查后，自行点击发送。';
      title.focus();
    });
    openDraft.addEventListener('click', event => {
      if (!draftReady) {
        event.preventDefault();
        return;
      }
      draftStatus.textContent = '正在尝试打开默认邮件应用。若没有打开，请复制邮件内容后手动发送。';
    });
    copyDraft.addEventListener('click', async () => {
      if (!draftReady) return;
      try {
        await navigator.clipboard.writeText(draftText);
        draftStatus.textContent = '邮件内容已复制。请粘贴到你的邮件应用中检查并发送。';
      } catch {
        manualCopy.value = draftText;
        manualCopy.hidden = false;
        manualCopy.focus();
        manualCopy.select();
        draftStatus.textContent = '浏览器未允许自动复制。下方已显示邮件内容，请手动复制。';
      }
    });
    document.querySelector('#contact-edit-draft').addEventListener('click', () => fields.message.focus());
  }
})();

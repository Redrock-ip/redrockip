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
      status.textContent = terms.length || category !== 'all' ? `Matching questions: ${visible}.` : `Common questions: ${items.length}.`;
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
        emailStatus.textContent = 'Email address copied.';
      } catch {
        emailStatus.textContent = `Copy manually: ${email}`;
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
      draftStatus.textContent = 'Content changed. Select Preview Email Draft again to update it.';
      formStatus.textContent = 'Generate the draft again before opening it.';
    }
    form.addEventListener('input', invalidateDraft);
    form.addEventListener('change', invalidateDraft);
    form.addEventListener('submit', event => {
      event.preventDefault();
      Object.values(fields).forEach(field => field.setCustomValidity(''));
      if (!fields.name.value.trim()) fields.name.setCustomValidity('Enter your name.');
      if (fields.subject.value.trim().length < 2) fields.subject.setCustomValidity('Enter a subject with at least 2 characters.');
      if (fields.message.value.trim().length < 10) fields.message.setCustomValidity('Enter at least 10 characters of detail.');
      if (!form.reportValidity()) return;
      const subject = `[RED ROCK Inquiry] ${fields.subject.value.trim()}`;
      const body = [
        'Hello RED ROCK team:', '',
        `Name: ${fields.name.value.trim()}`,
        `Reply email: ${fields.email.value.trim()}`,
        `Inquiry type: ${fields.topic.value}`,
        `Related product: ${fields.product.value}`,
        '', 'Details:', fields.message.value.trim()
      ].join('\n');
      document.querySelector('#contact-draft-subject').textContent = subject;
      document.querySelector('#contact-draft-body').textContent = body;
      draftText = `To: ${email}\nSubject: ${subject}\n\n${body}`;
      openDraft.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      openDraft.setAttribute('aria-disabled', 'false');
      copyDraft.disabled = false;
      draftReady = true;
      review.hidden = false;
      manualCopy.hidden = true;
      formStatus.textContent = 'Draft created. Review it below. No email has been sent.';
      draftStatus.textContent = 'The draft is not sent automatically. Review it in your email app, then send it yourself.';
      title.focus();
    });
    openDraft.addEventListener('click', event => {
      if (!draftReady) {
        event.preventDefault();
        return;
      }
      draftStatus.textContent = 'Opening the default email app. If it does not open, copy the email content and send it manually.';
    });
    copyDraft.addEventListener('click', async () => {
      if (!draftReady) return;
      try {
        await navigator.clipboard.writeText(draftText);
        draftStatus.textContent = 'Email content copied. Paste it into your email app, review it and send it.';
      } catch {
        manualCopy.value = draftText;
        manualCopy.hidden = false;
        manualCopy.focus();
        manualCopy.select();
        draftStatus.textContent = 'Automatic copying is unavailable. The email content is shown below for manual copying.';
      }
    });
    document.querySelector('#contact-edit-draft').addEventListener('click', () => fields.message.focus());
  }
})();

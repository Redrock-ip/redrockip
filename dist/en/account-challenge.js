(() => {
  'use strict';

  function imageSource(value) {
    if (typeof value !== 'string') throw new Error('Missing CAPTCHA image');
    if (/^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/i.test(value) && value.length <= 1_400_000) return value;
    const url = new URL(value,location.origin);
    if (url.origin !== location.origin || !['http:','https:'].includes(url.protocol) || url.username || url.password) {
      throw new Error('Invalid CAPTCHA image source');
    }
    return url.href;
  }

  async function load({read,image,sample,preview}) {
    image.hidden = true;
    sample.hidden = true;
    const challenge = await read();
    if (typeof challenge?.challengeId !== 'string' || !challenge.challengeId) throw new Error('Invalid challenge');
    if (preview) {
      sample.textContent = challenge.previewText;
      sample.hidden = false;
    } else {
      image.src = imageSource(challenge.imageUrl);
      await image.decode();
      image.hidden = false;
    }
    return challenge.challengeId;
  }

  window.RedRockAccountChallenge = {load};
})();

(() => {
  'use strict';

  let current = '';
  window.RedRockRegistrationPreview = {
    getRegistrationCaptcha() {
      current = String(1000+Math.floor(Math.random()*9000));
      return {challengeId:'registration-preview',previewText:current};
    },
    sendRegistrationCode({challengeId,captcha}) {
      return {
        ok:challengeId === 'registration-preview' && captcha === current,
        retryAfterSeconds:8,
        notice:'The preview code is 123456.'
      };
    },
    registerAccount({code}) {
      return {ok:code === '123456',notice:'You have completed the registration preview.'};
    }
  };
})();

(() => {
  'use strict';
  let currentChallenge = '';
  window.RedRockRecoveryPreview = {
    getRecoveryCaptcha() {
      currentChallenge = String(1000+Math.floor(Math.random()*9000));
      return {challengeId:'local-preview',previewText:currentChallenge};
    },
    sendRecoveryCode({challengeId,captcha}) {
      return {ok:challengeId === 'local-preview' && captcha === currentChallenge,retryAfterSeconds:8,notice:'The preview code is 123456.'};
    },
    resetPassword({code}) {
      return {ok:code === '123456',notice:'You have completed the password recovery preview.'};
    }
  };
})();

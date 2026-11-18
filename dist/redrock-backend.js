/* Bind the existing API methods described in CONNECT-API.md. Keep private keys on the server. */
window.RedRockBackend = {
  allowedRedirectOrigins: [],
  // login: async ({email, password, remember}, context) => ({redirect: '/dashboard'}),
  // getRegistrationCaptcha: async (input, context) => ({challengeId, imageUrl}),
  // sendRegistrationCode: async ({email, challengeId, captcha}, context) => ({ok: true, retryAfterSeconds: 60}),
  // registerAccount: async ({email, code, password, inviteCode, termsAccepted}, context) => ({ok: true, redirect}),
  // getRecoveryCaptcha: async (input, context) => ({challengeId, imageUrl}),
  // sendRecoveryCode: async ({email, challengeId, captcha}, context) => ({ok: true, retryAfterSeconds: 60}),
  // resetPassword: async ({email, code, newPassword}, context) => ({ok: true}),
  // startGoogleLogin: async (input, context) => ({redirect}),
  // loadStartingPrices: async (input, context) => ({prices: {dynamic: "$0.50/GB 起"}}),
  // loadPurchaseCatalog: async (input, context) => ({products: [...]}),
  // quotePurchase: async ({productId, planId, quantity, promoCode}, context) => ({quoteId, totalCents, discountCents}),
  // createOrder: async ({quoteId}, context) => ({orderId, redirect}),
  // createRecharge: async ({amountCents, paymentMethod}, context) => ({redirect}),
  // loadTrafficDetails: async ({productId, from, to, interval}, context) => ({summary, points, countries, domains}),
  // loadUsage: async ({productId, days}, context) => ({rows: []}),
  // loadUnlimitedKeys: async (input, context) => ({keys: []}),
  // loadUnlimitedUsage: async ({keyId, range}, context) => ({totalBytes, uploadBytes, downloadBytes, averageMbps, peakMbps, maxConnections, points}),
  // requestService: async ({productId, mode, fields}, context) => ({details: [], connection: ''}),
  // mountPage: async (context) => { /* Load and render account data. */ }
};

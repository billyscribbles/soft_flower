// Checkout settings — plain data, no browser APIs.
// Lives in its own file (not site.config.js) because the Node payment server
// imports it directly, and site.config.js uses import.meta.env (Vite-only).

export const checkoutConfig = {
  leadTimeDays: 3,
  flatShippingAUD: 10,
  freeShippingThresholdAUD: 150,
  pickupEnabled: false,
  currency: 'AUD',
}

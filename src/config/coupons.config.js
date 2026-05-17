// Coupon codes — plain data, no browser APIs.
// Lives in its own file (like checkout.config.js) because the Node payment
// server imports it directly. Edit this list to add, change, or retire codes.
//
// type:  'percent'  — value is a whole-number percent off the subtotal (10 = 10%)
//        'fixed'    — value is an AUD amount off the subtotal
//        'shipping' — waives the delivery fee; value is ignored
// expiresAt: ISO date string, or null to never expire. The code stops working
//            on and after this date. A bare date ('2026-09-01') is read as
//            midnight UTC; a malformed string disables the code.

export const coupons = [
  { code: 'SPRING10', type: 'percent', value: 10, expiresAt: '2026-09-01', label: '10% off' },
  { code: 'WELCOME5', type: 'fixed', value: 5, expiresAt: null, label: '$5 off' },
  { code: 'FREESHIP', type: 'shipping', value: null, expiresAt: '2026-07-01', label: 'Free shipping' },
]

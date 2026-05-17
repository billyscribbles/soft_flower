// Coupon logic — pure functions, no browser APIs.
// Imported by both the browser (instant checkout feedback) and the Node
// payment server (server.js, the authority on price). Same pattern as
// cart-totals.js.

import { coupons } from '../config/coupons.config.js'

// Find a coupon by code — case-insensitive and trimmed. Returns the coupon
// object or null.
export function findCoupon(code) {
  if (typeof code !== 'string') return null
  const normalized = code.trim().toLowerCase()
  if (!normalized) return null
  return coupons.find((c) => c.code.toLowerCase() === normalized) || null
}

// Check whether a coupon is usable right now. `now` is a Date (passed in so
// this stays pure and testable). Returns { valid, reason } where reason is
// one of null | 'unknown' | 'expired'.
//
// A bare `expiresAt` date ('2026-09-01') is parsed as midnight UTC. A
// malformed date string is treated as 'unknown' so a config typo disables
// the code rather than making it valid forever.
export function validateCoupon(coupon, now) {
  if (!coupon) return { valid: false, reason: 'unknown' }
  if (coupon.expiresAt) {
    const expiry = new Date(coupon.expiresAt)
    if (Number.isNaN(expiry.getTime())) {
      return { valid: false, reason: 'unknown' }
    }
    if (now.getTime() >= expiry.getTime()) {
      return { valid: false, reason: 'expired' }
    }
  }
  return { valid: true, reason: null }
}

// Compute the discount a coupon produces for an order.
// Returns { discount, shippingAfter }:
//   discount      — AUD taken off the subtotal (0 for free-shipping coupons)
//   shippingAfter — the shipping fee after the coupon (0 for free shipping)
// Final order total = subtotal - discount + shippingAfter.
//
// Money is rounded to whole cents. A non-finite subtotal or coupon value
// yields a zero discount rather than letting NaN reach the charged total.
export function applyCoupon({ coupon, subtotal, shipping }) {
  if (!coupon || !Number.isFinite(subtotal)) {
    return { discount: 0, shippingAfter: shipping }
  }

  if (coupon.type === 'percent') {
    const value = Number.isFinite(coupon.value) ? coupon.value : 0
    const discount = Math.round(subtotal * (value / 100) * 100) / 100
    return { discount, shippingAfter: shipping }
  }

  if (coupon.type === 'fixed') {
    const value = Number.isFinite(coupon.value) ? coupon.value : 0
    return { discount: Math.min(value, subtotal), shippingAfter: shipping }
  }

  if (coupon.type === 'shipping') {
    return { discount: 0, shippingAfter: 0 }
  }

  return { discount: 0, shippingAfter: shipping }
}

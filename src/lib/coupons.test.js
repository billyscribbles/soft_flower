import { describe, it, expect } from 'vitest'
import { findCoupon, validateCoupon, applyCoupon } from './coupons.js'

describe('findCoupon', () => {
  it('finds a code case-insensitively and trimmed', () => {
    expect(findCoupon('  spring10 ')?.code).toBe('SPRING10')
    expect(findCoupon('WELCOME5')?.code).toBe('WELCOME5')
  })

  it('returns null for an unknown code', () => {
    expect(findCoupon('NOPE')).toBe(null)
  })

  it('returns null for empty or non-string input', () => {
    expect(findCoupon('')).toBe(null)
    expect(findCoupon('   ')).toBe(null)
    expect(findCoupon(null)).toBe(null)
    expect(findCoupon(undefined)).toBe(null)
    expect(findCoupon(42)).toBe(null)
  })
})

describe('validateCoupon', () => {
  it('marks a null coupon as unknown', () => {
    expect(validateCoupon(null, new Date())).toEqual({ valid: false, reason: 'unknown' })
  })

  it('accepts a coupon with no expiry', () => {
    const coupon = { code: 'X', type: 'fixed', value: 5, expiresAt: null }
    expect(validateCoupon(coupon, new Date())).toEqual({ valid: true, reason: null })
  })

  it('accepts a coupon before its expiry date', () => {
    const coupon = { code: 'X', type: 'percent', value: 10, expiresAt: '2026-09-01' }
    expect(validateCoupon(coupon, new Date('2026-08-31T23:00:00Z')).valid).toBe(true)
  })

  it('rejects a coupon on or after its expiry date', () => {
    const coupon = { code: 'X', type: 'percent', value: 10, expiresAt: '2026-09-01' }
    expect(validateCoupon(coupon, new Date('2026-09-01T00:00:00Z'))).toEqual({
      valid: false,
      reason: 'expired',
    })
    expect(validateCoupon(coupon, new Date('2026-10-01T00:00:00Z')).valid).toBe(false)
  })

  it('treats a malformed expiry date as unknown', () => {
    const coupon = { code: 'X', type: 'fixed', value: 5, expiresAt: 'not-a-date' }
    expect(validateCoupon(coupon, new Date())).toEqual({ valid: false, reason: 'unknown' })
  })
})

describe('applyCoupon', () => {
  it('returns no discount when there is no coupon', () => {
    expect(applyCoupon({ coupon: null, subtotal: 100, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 12,
    })
  })

  it('applies a percentage discount to the subtotal', () => {
    const coupon = { code: 'X', type: 'percent', value: 10 }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 })).toEqual({
      discount: 10,
      shippingAfter: 12,
    })
  })

  it('rounds a percentage discount to cents', () => {
    const coupon = { code: 'X', type: 'percent', value: 10 }
    expect(applyCoupon({ coupon, subtotal: 33.33, shipping: 0 }).discount).toBe(3.33)
  })

  it('applies a fixed discount', () => {
    const coupon = { code: 'X', type: 'fixed', value: 5 }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 }).discount).toBe(5)
  })

  it('never lets a fixed discount exceed the subtotal', () => {
    const coupon = { code: 'X', type: 'fixed', value: 50 }
    expect(applyCoupon({ coupon, subtotal: 30, shipping: 12 }).discount).toBe(30)
  })

  it('waives shipping for a shipping coupon', () => {
    const coupon = { code: 'X', type: 'shipping', value: null }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 0,
    })
  })

  it('returns no discount for an unrecognised coupon type', () => {
    const coupon = { code: 'X', type: 'mystery', value: 10 }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 12,
    })
  })

  it('returns no discount when the coupon value is not a number', () => {
    const coupon = { code: 'X', type: 'percent', value: undefined }
    expect(applyCoupon({ coupon, subtotal: 100, shipping: 12 }).discount).toBe(0)
  })

  it('returns no discount when subtotal is not a number', () => {
    const coupon = { code: 'X', type: 'percent', value: 10 }
    expect(applyCoupon({ coupon, subtotal: NaN, shipping: 12 })).toEqual({
      discount: 0,
      shippingAfter: 12,
    })
  })
})

// TODO: Wire to Stripe Checkout Session or Shopify Buy SDK.
// This is a UI-only stub that simulates a successful submit so the rest of the
// checkout flow (clear cart, confirmation page, order summary) can be built
// and tested without a backend. Replace the body of submitOrder when payment
// integration lands.

export async function submitOrder(order) {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    ok: true,
    reference: `SF-${Date.now().toString(36).toUpperCase()}`,
    order,
  }
}

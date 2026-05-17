import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { stripePromise } from '../../lib/stripe.js'
import { useCart } from '../../context/CartContext.jsx'
import { checkout } from '../../content/checkout.js'
import { formatAUD } from '../../lib/money.js'
import './PaymentStep.css'

// Light theming so the Stripe iframe blends with the soft florals palette.
const appearance = {
  theme: 'stripe',
  variables: {
    fontFamily: 'inherit',
    borderRadius: '12px',
    colorPrimary: '#b98a9e',
    colorText: '#333333',
    spacingUnit: '4px',
  },
}

function PaymentForm({ order, orderRef, total }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { payment } = checkout

  const [status, setStatus] = useState('idle') // idle | processing | error
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || status === 'processing') return

    setStatus('processing')
    setError(null)

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
      confirmParams: {
        return_url: `${window.location.origin}/order/thanks`,
      },
    })

    if (confirmError) {
      setStatus('error')
      setError(confirmError.message || payment.error)
      return
    }

    if (paymentIntent?.status === 'succeeded') {
      // Navigate first, then empty the cart, so the route is already gone
      // before CheckoutPage can react to an empty cart.
      navigate('/order/thanks', {
        state: { order, reference: orderRef },
        replace: true,
      })
      clearCart()
      return
    }

    // Any other status (processing, requires_action handled by Stripe, etc.)
    setStatus('error')
    setError(payment.error)
  }

  return (
    <form className="payment-step__form" onSubmit={handleSubmit}>
      <PaymentElement options={{ layout: 'tabs' }} />

      <button
        type="submit"
        className="payment-step__pay"
        disabled={!stripe || status === 'processing'}
      >
        {status === 'processing'
          ? payment.processing
          : `${payment.payCta} ${formatAUD(total)}`}
      </button>

      <p className="payment-step__secured">{payment.securedNote}</p>

      {status === 'error' && error && (
        <p className="payment-step__error">{error}</p>
      )}
    </form>
  )
}

export default function PaymentStep({ clientSecret, order, orderRef, total, onEdit }) {
  const { payment } = checkout

  if (!stripePromise || !clientSecret) {
    return <p className="payment-step__error">{payment.configError}</p>
  }

  return (
    <div className="payment-step">
      <div className="payment-step__head">
        <div>
          <span className="payment-step__legend">{payment.legend}</span>
          <h2 className="payment-step__heading">{payment.heading}</h2>
          <p className="payment-step__sub">{payment.sub}</p>
        </div>
        <button type="button" className="payment-step__edit" onClick={onEdit}>
          {payment.editLabel}
        </button>
      </div>

      <Elements stripe={stripePromise} options={{ clientSecret, appearance }}>
        <PaymentForm order={order} orderRef={orderRef} total={total} />
      </Elements>
    </div>
  )
}

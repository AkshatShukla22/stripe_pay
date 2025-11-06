import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import '../styles/CheckoutForm.css';

function CheckoutForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/checkout',
      },
      redirect: 'if_required',
    });

    if (submitError) {
      setError(submitError.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="payment-element-container">
        <PaymentElement />
      </div>
      {error && (
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <span>{error}</span>
        </div>
      )}
      <button type="submit" disabled={!stripe || loading} className="pay-button">
        {loading ? (
          <>
            <i className="fas fa-spinner fa-spin"></i>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <i className="fas fa-lock"></i>
            <span>Pay Now</span>
          </>
        )}
      </button>
    </form>
  );
}

export default CheckoutForm;
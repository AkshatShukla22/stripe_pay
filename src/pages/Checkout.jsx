import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../components/CheckoutForm';
import { createPaymentIntent, confirmPayment } from '../utils/api';
import { clearCart } from '../redux/slices/cartSlice';
import '../styles/Checkout.css';

// Replace with your actual Stripe publishable key from backend .env
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Debug log
console.log('Stripe Key Loaded:', stripeKey ? 'Yes ✓' : 'No ✗');
console.log('Stripe Key Preview:', stripeKey ? stripeKey.substring(0, 20) + '...' : 'MISSING');

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// Error if key is missing
if (!stripeKey) {
  console.error('STRIPE PUBLISHABLE KEY NOT FOUND!');
  console.error('Make sure .env.local exists in frontend root with VITE_STRIPE_PUBLISHABLE_KEY');
}

function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const taxRate = 0.1;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + taxAmount;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
      return;
    }

    const initializePayment = async () => {
      try {
        const response = await createPaymentIntent({
          amount: finalTotal,
          items: items.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          }))
        });
        setClientSecret(response.data.clientSecret);
        setPaymentIntentId(response.data.paymentIntentId);
        setLoading(false);
      } catch (error) {
        console.error('Payment initialization error:', error);
        setLoading(false);
      }
    };

    initializePayment();
  }, [items, finalTotal, navigate]);

  const handlePaymentSuccess = async () => {
    try {
      await confirmPayment({
        paymentIntentId,
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: finalTotal,
        customerEmail: email
      });
      
      setPaymentSuccess(true);
      
      setTimeout(() => {
        dispatch(clearCart());
        navigate('/products');
      }, 3000);
    } catch (error) {
      console.error('Payment confirmation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
        <p>Preparing checkout...</p>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <div className="success-icon">
          <i className="fas fa-check-circle"></i>
        </div>
        <h1>Payment Successful!</h1>
        <p>Thank you for your order. You will be redirected shortly...</p>
        <div className="success-animation">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
  };

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>
          <i className="fas fa-credit-card"></i>
          Secure Checkout
        </h1>
        <div className="checkout-steps">
          <div className="step active">
            <i className="fas fa-shopping-cart"></i>
            <span>Cart</span>
          </div>
          <div className="step-line"></div>
          <div className="step active">
            <i className="fas fa-credit-card"></i>
            <span>Payment</span>
          </div>
          <div className="step-line"></div>
          <div className="step">
            <i className="fas fa-check-circle"></i>
            <span>Confirmation</span>
          </div>
        </div>
      </div>

      <div className="checkout-container">
        <div className="order-summary-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-receipt"></i>
              Order Summary
            </h2>
          </div>
          
          <div className="order-items">
            {items.map((item) => (
              <div key={item._id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <div className="item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="order-row">
              <span>Subtotal</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="order-row">
              <span>Tax (10%)</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            <div className="order-divider"></div>
            <div className="order-row total">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">
              <i className="fas fa-lock"></i>
              <span>SSL Encrypted</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-shield-alt"></i>
              <span>100% Secure</span>
            </div>
            <div className="trust-badge">
              <i className="fas fa-undo"></i>
              <span>Easy Returns</span>
            </div>
          </div>
        </div>

        <div className="payment-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-credit-card"></i>
              Payment Details
            </h2>
          </div>

          <div className="email-section">
            <label>
              <i className="fas fa-envelope"></i>
              Email Address
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              required
            />
          </div>

          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <CheckoutForm onSuccess={handlePaymentSuccess} />
            </Elements>
          )}

          <div className="payment-methods">
            <p>We accept:</p>
            <div className="method-icons">
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-amex"></i>
              <i className="fab fa-cc-discover"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
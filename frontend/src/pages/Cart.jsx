import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItem from '../components/CartItem';
import '../styles/Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);

  const taxRate = 0.1;
  const taxAmount = totalAmount * taxRate;
  const finalTotal = totalAmount + taxAmount;

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">
          <i className="fas fa-shopping-cart"></i>
        </div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet</p>
        <button onClick={() => navigate('/products')} className="shop-now-btn">
          <i className="fas fa-store"></i>
          <span>Start Shopping</span>
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>
          <i className="fas fa-shopping-cart"></i>
          Shopping Cart
        </h1>
        <span className="items-count">{items.length} {items.length === 1 ? 'item' : 'items'}</span>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}
        </div>

        <div className="cart-summary">
          <div className="summary-header">
            <h2>
              <i className="fas fa-receipt"></i>
              Order Summary
            </h2>
          </div>
          
          <div className="summary-content">
            <div className="summary-row">
              <span className="summary-label">
                <i className="fas fa-box"></i>
                Subtotal
              </span>
              <span className="summary-value">${totalAmount.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span className="summary-label">
                <i className="fas fa-percentage"></i>
                Tax (10%)
              </span>
              <span className="summary-value">${taxAmount.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-row total-row">
              <span className="summary-label">
                <i className="fas fa-wallet"></i>
                Total
              </span>
              <span className="summary-value total-value">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={handleCheckout} className="checkout-btn">
            <i className="fas fa-lock"></i>
            <span>Proceed to Checkout</span>
          </button>

          <div className="security-badges">
            <div className="badge">
              <i className="fas fa-shield-alt"></i>
              <span>Secure Payment</span>
            </div>
            <div className="badge">
              <i className="fas fa-truck"></i>
              <span>Free Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
import React from 'react';
import { useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import '../styles/CartItem.css';

function CartItem({ item }) {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(item._id));
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity({ id: item._id, quantity: newQuantity }));
    }
  };

  return (
    <div className="cart-item">
      <div className="cart-item-image-container">
        <img src={item.image} alt={item.name} className="cart-item-image" />
      </div>
      <div className="cart-item-details">
        <h3 className="cart-item-name">{item.name}</h3>
        <p className="cart-item-category">
          <i className="fas fa-tag"></i>
          {item.category}
        </p>
        <p className="cart-item-price">${item.price.toFixed(2)} each</p>
      </div>
      <div className="cart-item-actions">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="quantity-btn"
          >
            <i className="fas fa-minus"></i>
          </button>
          <span className="quantity-display">{item.quantity}</span>
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="quantity-btn"
          >
            <i className="fas fa-plus"></i>
          </button>
        </div>
        <button onClick={handleRemove} className="remove-btn">
          <i className="fas fa-trash-alt"></i>
          <span>Remove</span>
        </button>
      </div>
      <div className="cart-item-total">
        <span className="total-label">Total</span>
        <span className="total-price">${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartItem;
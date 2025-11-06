import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        <div className="product-overlay">
          <button onClick={handleAddToCart} className={`add-to-cart-btn ${added ? 'added' : ''}`}>
            <i className={`fas ${added ? 'fa-check' : 'fa-shopping-cart'}`}></i>
            <span>{added ? 'Added!' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-name">{product.name}</h3>
          <span className="product-category">
            <i className="fas fa-tag"></i>
            {product.category}
          </span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <div className="product-price-container">
            <span className="product-price">${product.price.toFixed(2)}</span>
          </div>
          <div className="product-stock">
            <i className="fas fa-box"></i>
            <span>{product.stock} in stock</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
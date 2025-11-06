import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import '../styles/Navbar.css';

function Navbar() {
  const location = useLocation();
  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <i className="fas fa-shopping-bag"></i>
          <span>E-Shop</span>
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link 
              to="/products" 
              className={location.pathname === '/products' || location.pathname === '/' ? 'active' : ''}
            >
              <i className="fas fa-store"></i>
              <span>Products</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={location.pathname === '/dashboard' ? 'active' : ''}
            >
              <i className="fas fa-chart-line"></i>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/cart" 
              className={`cart-link ${location.pathname === '/cart' ? 'active' : ''}`}
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Cart</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
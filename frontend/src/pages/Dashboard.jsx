import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, addProduct, editProduct, removeProduct } from '../redux/slices/productSlice';
import '../styles/Dashboard.css';

function Dashboard() {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    category: ''
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editMode) {
      dispatch(editProduct({ id: currentProduct._id, data: formData }));
    } else {
      dispatch(addProduct(formData));
    }
    resetForm();
  };

  const handleEdit = (product) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(removeProduct(id));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      image: '',
      stock: '',
      category: ''
    });
    setShowForm(false);
    setEditMode(false);
    setCurrentProduct(null);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <i className="fas fa-chart-line"></i>
            Product Dashboard
          </h1>
          <p className="header-subtitle">Manage your product inventory</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)} 
          className={`add-product-btn ${showForm ? 'cancel' : ''}`}
        >
          <i className={`fas ${showForm ? 'fa-times' : 'fa-plus'}`}></i>
          <span>{showForm ? 'Cancel' : 'Add Product'}</span>
        </button>
      </div>

      {showForm && (
        <div className="product-form-container">
          <div className="form-header">
            <h2>
              <i className={`fas ${editMode ? 'fa-edit' : 'fa-plus-circle'}`}></i>
              {editMode ? 'Edit Product' : 'Add New Product'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-grid">
              <div className="form-group">
                <label>
                  <i className="fas fa-box"></i>
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-tag"></i>
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="Enter category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-dollar-sign"></i>
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <i className="fas fa-warehouse"></i>
                  Stock
                </label>
                <input
                  type="number"
                  name="stock"
                  placeholder="Enter stock quantity"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>
                <i className="fas fa-align-left"></i>
                Description
              </label>
              <textarea
                name="description"
                placeholder="Enter product description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group full-width">
              <label>
                <i className="fas fa-image"></i>
                Image URL
              </label>
              <input
                type="text"
                name="image"
                placeholder="Enter image URL"
                value={formData.image}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="submit-btn">
              <i className={`fas ${editMode ? 'fa-save' : 'fa-plus'}`}></i>
              <span>{editMode ? 'Update Product' : 'Add Product'}</span>
            </button>
          </form>
        </div>
      )}

      <div className="products-table-container">
        <div className="table-header">
          <h2>
            <i className="fas fa-list"></i>
            All Products ({products.length})
          </h2>
        </div>
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th><i className="fas fa-image"></i> Image</th>
                <th><i className="fas fa-box"></i> Name</th>
                <th><i className="fas fa-dollar-sign"></i> Price</th>
                <th><i className="fas fa-warehouse"></i> Stock</th>
                <th><i className="fas fa-tag"></i> Category</th>
                <th><i className="fas fa-cogs"></i> Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <div className="table-image-container">
                      <img src={product.image} alt={product.name} className="table-image" />
                    </div>
                  </td>
                  <td className="product-name-cell">{product.name}</td>
                  <td className="price-cell">${product.price.toFixed(2)}</td>
                  <td>
                    <span className={`stock-badge ${product.stock < 10 ? 'low' : ''}`}>
                      {product.stock}
                    </span>
                  </td>
                  <td>
                    <span className="category-badge">
                      {product.category}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleEdit(product)} className="edit-btn">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button onClick={() => handleDelete(product._id)} className="delete-btn">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
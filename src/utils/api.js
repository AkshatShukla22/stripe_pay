import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const fetchProducts = () => axios.get(`${API_URL}/products`);
export const createProduct = (data) => axios.post(`${API_URL}/products`, data);
export const updateProduct = (id, data) => axios.put(`${API_URL}/products/${id}`, data);
export const deleteProduct = (id) => axios.delete(`${API_URL}/products/${id}`);

export const createPaymentIntent = (data) => axios.post(`${API_URL}/payment/create-payment-intent`, data);
export const confirmPayment = (data) => axios.post(`${API_URL}/payment/confirm`, data);
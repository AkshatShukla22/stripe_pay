const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

dotenv.config();

console.log('PORT:', process.env.PORT);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded ' : 'Missing ');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Loaded ' : 'Missing ');
console.log('STRIPE_SECRET_KEY Preview:', process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 15) + '...' : 'NOT FOUND');


const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get('/api/test-config', (req, res) => {
  res.json({
    stripeConfigured: !!process.env.STRIPE_SECRET_KEY,
    stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 15) : 'NOT SET',
    mongodbConfigured: !!process.env.MONGODB_URI,
    port: process.env.PORT
  });
});

app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'E-Commerce API Running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
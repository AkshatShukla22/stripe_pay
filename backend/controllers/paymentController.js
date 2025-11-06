const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    
    console.log('Environment variable check:');
    console.log('- Key exists:', !!stripeKey);
    console.log('- Key length:', stripeKey ? stripeKey.length : 0);
    console.log('- Key preview:', stripeKey ? stripeKey.substring(0, 20) + '...' : 'MISSING');
    
    if (!stripeKey) {
      console.error('STRIPE_SECRET_KEY is not set!');
      return res.status(500).json({ 
        message: 'Payment system not configured',
        error: 'STRIPE_SECRET_KEY missing'
      });
    }

    const stripe = require('stripe')(stripeKey.trim());
    console.log('Stripe initialized successfully');
    
    const { amount, items } = req.body;
    
    console.log('Request data:');
    console.log('- Amount:', amount);
    console.log('- Items:', items);

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ 
        message: 'Invalid amount',
        received: amount 
      });
    }

    const amountInCents = Math.round(amount * 100);
    console.log('- Amount in cents:', amountInCents);

    console.log('Creating payment intent with Stripe...');
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    console.log('Payment intent created successfully!');
    console.log('Payment Intent ID:', paymentIntent.id);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Error type:', error.type);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    res.status(500).json({ 
      message: error.message,
      type: error.type,
      help: 'Check backend console for details'
    });
  }
};

exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, items, totalAmount, customerEmail } = req.body;

    console.log('Payment Intent ID:', paymentIntentId);

    const order = new Order({
      items,
      totalAmount,
      paymentIntentId,
      customerEmail,
      status: 'completed'
    });

    await order.save();

    console.log('Order saved successfully:', order._id);

    res.json({ 
      success: true, 
      message: 'Payment successful',
      orderId: order._id 
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: error.message });
  }
};
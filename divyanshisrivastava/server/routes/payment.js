const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Parking = require('../models/Parking');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'your_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_key_secret'
});

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { parkingId, amount } = req.body;

    const parking = await Parking.findOne({ 
      _id: parkingId, 
      userId: req.userId 
    });

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `parking_${parkingId}_${Date.now()}`,
      notes: {
        parkingId: parkingId.toString(),
        vehicleNumber: parking.vehicleNumber,
        slot: parking.parkingSlot
      }
    };

    const order = await razorpay.orders.create(options);

    // Update parking with order ID
    parking.razorpayOrderId = order.id;
    await parking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'your_key_id'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify payment
router.post('/verify', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, parkingId } = req.body;

    const parking = await Parking.findOne({ 
      _id: parkingId, 
      userId: req.userId 
    });

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'your_key_secret')
      .update(text)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment successful
      parking.paymentStatus = 'completed';
      parking.paymentId = razorpay_payment_id;
      await parking.save();

      res.json({
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id
      });
    } else {
      // Payment failed
      parking.paymentStatus = 'failed';
      await parking.save();

      res.status(400).json({ message: 'Payment verification failed' });
    }
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


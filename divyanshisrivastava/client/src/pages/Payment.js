import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Payment.css';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parking, setParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    loadPaymentData();
  }, [id]);

  const loadPaymentData = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking/active`);
      const parkingData = response.data;
      if (parkingData._id === id) {
        setParking(parkingData);
      } else {
        toast.error('Parking not found');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to load payment data');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!parking) return;

    setProcessing(true);
    try {
      // Create Razorpay order
      const orderResponse = await axios.post(`${API_URL}/payment/create-order`, {
        parkingId: parking._id,
        amount: parking.amount
      });

      const { orderId, amount, key } = orderResponse.data;

      // Initialize Razorpay checkout
      const options = {
        key: key,
        amount: amount,
        currency: 'INR',
        name: 'Parking App',
        description: `Parking payment for ${parking.vehicleNumber}`,
        order_id: orderId,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(`${API_URL}/payment/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              parkingId: parking._id
            });

            if (verifyResponse.data) {
              toast.success('Payment successful!');
              navigate('/dashboard');
            }
          } catch (error) {
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).name : '',
          email: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).email : '',
        },
        theme: {
          color: '#667eea'
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      razorpay.on('payment.failed', function (response) {
        toast.error('Payment failed. Please try again.');
        setProcessing(false);
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="payment-loading">Loading...</div>;
  }

  if (!parking) {
    return null;
  }

  return (
    <div className="payment">
      <div className="container">
        <h1 className="payment-title">Payment</h1>
        <div className="payment-card">
          <h2>Payment Details</h2>
          <div className="payment-info">
            <div className="info-row">
              <span className="info-label">Vehicle Number:</span>
              <span className="info-value">{parking.vehicleNumber}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Parking Slot:</span>
              <span className="info-value">{parking.parkingSlot}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Vehicle Type:</span>
              <span className="info-value">{parking.vehicleType}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Entry Time:</span>
              <span className="info-value">
                {new Date(parking.entryTime).toLocaleString()}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Duration:</span>
              <span className="info-value">
                {parking.duration ? `${parking.duration} minutes` : 'N/A'}
              </span>
            </div>
            <div className="amount-row">
              <span className="amount-label">Total Amount:</span>
              <span className="amount-value">₹{parking.amount}</span>
            </div>
          </div>
          <button
            onClick={handlePayment}
            className="btn btn-primary btn-payment"
            disabled={processing || parking.paymentStatus === 'completed'}
          >
            {processing
              ? 'Processing...'
              : parking.paymentStatus === 'completed'
              ? 'Payment Completed'
              : `Pay ₹${parking.amount}`}
          </button>
          {parking.paymentStatus === 'completed' && (
            <p className="payment-success">✅ Payment already completed</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;


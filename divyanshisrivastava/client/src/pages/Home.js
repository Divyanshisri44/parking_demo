import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Find Your Perfect Parking Spot</h1>
          <p className="hero-subtitle">
            Book parking slots instantly. Fast, secure, and convenient parking solutions.
          </p>
          {user ? (
            <Link to="/booking" className="btn btn-primary btn-large">
              Book Now
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-large">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-secondary btn-large">
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Quick Booking</h3>
              <p>Book your parking slot in seconds with our easy-to-use interface</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure Payment</h3>
              <p>Safe and secure payment gateway with Razorpay integration</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Real-time Availability</h3>
              <p>Check slot availability in real-time before booking</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Easy Management</h3>
              <p>Manage all your parking bookings from one dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


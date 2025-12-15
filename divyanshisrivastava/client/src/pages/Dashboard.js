import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Dashboard.css';

const Dashboard = () => {
  const [activeParking, setActiveParking] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchActiveParking();
  }, []);

  const fetchActiveParking = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking/active`);
      setActiveParking(response.data);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error('Failed to fetch active parking');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="container">
        <h1 className="dashboard-title">Dashboard</h1>
        
        {activeParking ? (
          <div className="active-parking-card">
            <h2>Active Parking</h2>
            <div className="parking-details">
              <div className="detail-item">
                <span className="label">Vehicle Number:</span>
                <span className="value">{activeParking.vehicleNumber}</span>
              </div>
              <div className="detail-item">
                <span className="label">Slot:</span>
                <span className="value">{activeParking.parkingSlot}</span>
              </div>
              <div className="detail-item">
                <span className="label">Entry Time:</span>
                <span className="value">
                  {new Date(activeParking.entryTime).toLocaleString()}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Amount:</span>
                <span className="value">₹{activeParking.amount}</span>
              </div>
              <div className="detail-item">
                <span className="label">Payment Status:</span>
                <span className={`value status-${activeParking.paymentStatus}`}>
                  {activeParking.paymentStatus}
                </span>
              </div>
              {activeParking.paymentStatus === 'pending' && (
                <Link 
                  to={`/payment/${activeParking._id}`}
                  className="btn btn-primary"
                >
                  Pay Now
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="no-parking-card">
            <h2>No Active Parking</h2>
            <p>You don't have any active parking bookings.</p>
            <Link to="/booking" className="btn btn-primary">
              Book Parking
            </Link>
          </div>
        )}

        <div className="dashboard-actions">
          <Link to="/booking" className="action-card">
            <div className="action-icon">🚗</div>
            <h3>Book Parking</h3>
            <p>Reserve your parking slot</p>
          </Link>
          <Link to="/history" className="action-card">
            <div className="action-icon">📜</div>
            <h3>View History</h3>
            <p>Check your past bookings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


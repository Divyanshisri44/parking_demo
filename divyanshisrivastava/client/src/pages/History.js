import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import './History.css';

const History = () => {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking/history`);
      setParkings(response.data);
    } catch (error) {
      toast.error('Failed to fetch parking history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="history-loading">Loading...</div>;
  }

  return (
    <div className="history">
      <div className="container">
        <h1 className="history-title">Parking History</h1>
        {parkings.length === 0 ? (
          <div className="no-history">
            <p>No parking history found</p>
          </div>
        ) : (
          <div className="history-list">
            {parkings.map((parking) => (
              <div key={parking._id} className="history-card">
                <div className="history-header">
                  <h3>{parking.vehicleNumber}</h3>
                  <span className={`status-badge status-${parking.status}`}>
                    {parking.status}
                  </span>
                </div>
                <div className="history-details">
                  <div className="detail-row">
                    <span className="detail-label">Slot:</span>
                    <span className="detail-value">{parking.parkingSlot}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Vehicle Type:</span>
                    <span className="detail-value">{parking.vehicleType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Entry Time:</span>
                    <span className="detail-value">
                      {new Date(parking.entryTime).toLocaleString()}
                    </span>
                  </div>
                  {parking.exitTime && (
                    <div className="detail-row">
                      <span className="detail-label">Exit Time:</span>
                      <span className="detail-value">
                        {new Date(parking.exitTime).toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">Duration:</span>
                    <span className="detail-value">
                      {parking.duration ? `${parking.duration} minutes` : 'N/A'}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Amount:</span>
                    <span className="detail-value amount">₹{parking.amount}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Payment:</span>
                    <span className={`detail-value status-${parking.paymentStatus}`}>
                      {parking.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;


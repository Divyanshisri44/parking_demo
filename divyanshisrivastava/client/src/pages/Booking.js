import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import './Booking.css';

const Booking = () => {
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    vehicleType: 'Car',
    slotNumber: '',
    duration: 60
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchSlots();
  }, [formData.vehicleType]);

  const fetchSlots = async () => {
    try {
      setFetchingSlots(true);
      const response = await axios.get(
        `${API_URL}/parking/slots?vehicleType=${formData.vehicleType}`
      );
      setSlots(response.data);
    } catch (error) {
      toast.error('Failed to fetch available slots');
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/parking/book`, formData);
      toast.success('Parking booked successfully!');
      navigate(`/payment/${response.data.parking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const calculateAmount = () => {
    const hours = formData.duration / 60;
    return Math.ceil(hours * 10);
  };

  return (
    <div className="booking">
      <div className="container">
        <h1 className="booking-title">Book Parking</h1>
        <div className="booking-content">
          <div className="booking-form-card">
            <h2>Enter Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Vehicle Number</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleChange}
                  required
                  placeholder="e.g., MH12AB1234"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>
              <div className="form-group">
                <label>Vehicle Type</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <option value="Car">Car</option>
                  <option value="Bike">Bike</option>
                  <option value="Truck">Truck</option>
                </select>
              </div>
              <div className="form-group">
                <label>Parking Slot</label>
                <select
                  name="slotNumber"
                  value={formData.slotNumber}
                  onChange={handleChange}
                  required
                  disabled={fetchingSlots}
                >
                  <option value="">Select a slot</option>
                  {slots.map((slot) => (
                    <option key={slot._id} value={slot.slotNumber}>
                      {slot.slotNumber} (Floor {slot.floor})
                    </option>
                  ))}
                </select>
                {fetchingSlots && <p className="loading-text">Loading slots...</p>}
              </div>
              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  required
                  min="30"
                  step="30"
                />
              </div>
              <div className="amount-preview">
                <strong>Estimated Amount: ₹{calculateAmount()}</strong>
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading || fetchingSlots}>
                {loading ? 'Booking...' : 'Book Now'}
              </button>
            </form>
          </div>
          <div className="slots-info-card">
            <h2>Available Slots</h2>
            {fetchingSlots ? (
              <p>Loading...</p>
            ) : slots.length === 0 ? (
              <p>No slots available for {formData.vehicleType}</p>
            ) : (
              <div className="slots-grid">
                {slots.map((slot) => (
                  <div
                    key={slot._id}
                    className={`slot-item ${formData.slotNumber === slot.slotNumber ? 'selected' : ''}`}
                  >
                    <div className="slot-number">{slot.slotNumber}</div>
                    <div className="slot-floor">Floor {slot.floor}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;


const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true
  },
  floor: {
    type: Number,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Car', 'Bike', 'Truck']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  currentBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parking',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);


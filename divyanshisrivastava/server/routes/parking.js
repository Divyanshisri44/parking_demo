const express = require('express');
const Parking = require('../models/Parking');
const ParkingSlot = require('../models/ParkingSlot');
const auth = require('../middleware/auth');

const router = express.Router();

// Get available parking slots
router.get('/slots', async (req, res) => {
  try {
    const { vehicleType } = req.query;
    const query = { isAvailable: true };
    if (vehicleType) {
      query.vehicleType = vehicleType;
    }

    const slots = await ParkingSlot.find(query).sort({ floor: 1, slotNumber: 1 });
    res.json(slots);
  } catch (error) {
    console.error('Get slots error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Book parking slot
router.post('/book', auth, async (req, res) => {
  try {
    const { vehicleNumber, vehicleType, slotNumber, duration } = req.body;

    // Find available slot
    const slot = await ParkingSlot.findOne({ 
      slotNumber, 
      vehicleType, 
      isAvailable: true 
    });

    if (!slot) {
      return res.status(400).json({ message: 'Slot not available' });
    }

    // Calculate amount (example: ₹10 per hour)
    const hours = duration / 60;
    const amount = Math.ceil(hours * 10);

    // Create parking booking
    const parking = new Parking({
      userId: req.userId,
      vehicleNumber,
      vehicleType,
      parkingSlot: slotNumber,
      duration,
      amount
    });

    await parking.save();

    // Update slot
    slot.isAvailable = false;
    slot.currentBooking = parking._id;
    await slot.save();

    res.status(201).json({
      message: 'Parking booked successfully',
      parking
    });
  } catch (error) {
    console.error('Book parking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's parking history
router.get('/history', auth, async (req, res) => {
  try {
    const parkings = await Parking.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(parkings);
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get active parking
router.get('/active', auth, async (req, res) => {
  try {
    const parking = await Parking.findOne({ 
      userId: req.userId, 
      status: 'active' 
    });
    res.json(parking);
  } catch (error) {
    console.error('Get active parking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Exit parking
router.post('/exit/:id', auth, async (req, res) => {
  try {
    const parking = await Parking.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!parking) {
      return res.status(404).json({ message: 'Parking not found' });
    }

    if (parking.status !== 'active') {
      return res.status(400).json({ message: 'Parking already completed' });
    }

    // Calculate exit time and final amount
    const exitTime = new Date();
    const entryTime = new Date(parking.entryTime);
    const actualDuration = Math.ceil((exitTime - entryTime) / (1000 * 60)); // minutes
    const hours = actualDuration / 60;
    const finalAmount = Math.ceil(hours * 10);

    parking.exitTime = exitTime;
    parking.duration = actualDuration;
    parking.amount = finalAmount;
    parking.status = 'completed';

    await parking.save();

    // Free up the slot
    const slot = await ParkingSlot.findOne({ slotNumber: parking.parkingSlot });
    if (slot) {
      slot.isAvailable = true;
      slot.currentBooking = null;
      await slot.save();
    }

    res.json({
      message: 'Parking exit successful',
      parking
    });
  } catch (error) {
    console.error('Exit parking error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;


const mongoose = require('mongoose');
const ParkingSlot = require('../models/ParkingSlot');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkingapp';

const seedSlots = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('Connected to MongoDB');

    // Clear existing slots
    await ParkingSlot.deleteMany({});
    console.log('Cleared existing slots');

    // Create parking slots
    const slots = [];

    // Floor 1 - Cars
    for (let i = 1; i <= 20; i++) {
      slots.push({
        slotNumber: `C1-${i.toString().padStart(2, '0')}`,
        floor: 1,
        vehicleType: 'Car',
        isAvailable: true
      });
    }

    // Floor 2 - Cars
    for (let i = 1; i <= 20; i++) {
      slots.push({
        slotNumber: `C2-${i.toString().padStart(2, '0')}`,
        floor: 2,
        vehicleType: 'Car',
        isAvailable: true
      });
    }

    // Floor 1 - Bikes
    for (let i = 1; i <= 30; i++) {
      slots.push({
        slotNumber: `B1-${i.toString().padStart(2, '0')}`,
        floor: 1,
        vehicleType: 'Bike',
        isAvailable: true
      });
    }

    // Floor 1 - Trucks
    for (let i = 1; i <= 10; i++) {
      slots.push({
        slotNumber: `T1-${i.toString().padStart(2, '0')}`,
        floor: 1,
        vehicleType: 'Truck',
        isAvailable: true
      });
    }

    await ParkingSlot.insertMany(slots);
    console.log(`✅ Created ${slots.length} parking slots`);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding slots:', error);
    process.exit(1);
  }
};

seedSlots();


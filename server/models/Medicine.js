import mongoose from 'mongoose';

const medicineSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    required: true,
    default: '1 tablet'
  },
  frequency: {
    type: String,
    required: true,
    enum: ['Once daily', 'Twice daily', 'Three times daily', 'Every 8 hours', 'Every 12 hours', 'As needed'],
    default: 'Once daily'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  reminderTimes: [{
    type: String,
    required: true
  }],
  compartment: {
    type: Number,
    min: 1,
    max: 6,
    default: 1
  },
  instructions: {
    type: String,
    default: 'Take with a glass of water after meals'
  },
  color: {
    type: String,
    default: '#10B981'
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;

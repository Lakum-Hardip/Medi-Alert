import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  time: {
    type: String, // e.g. "08:00 AM", "12:00 PM", "08:00 PM"
    required: true
  },
  date: {
    type: String, // YYYY-MM-DD
    required: true
  },
  compartment: {
    type: Number,
    min: 1,
    max: 6,
    default: 1
  },
  status: {
    type: String,
    enum: ['Pending', 'Taken', 'Missed', 'Snoozed'],
    default: 'Pending'
  },
  takenAt: {
    type: Date
  },
  notes: {
    type: String
  }
}, { timestamps: true });

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder;

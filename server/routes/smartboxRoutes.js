import express from 'express';
import Medicine from '../models/Medicine.js';
import Reminder from '../models/Reminder.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/smartbox/status
// @desc    Get real-time simulated smart box status
router.get('/status', auth, async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const medicines = await Medicine.find({ userId: req.user._id, active: true });
    const pendingReminders = await Reminder.find({
      userId: req.user._id,
      date: todayStr,
      status: 'Pending'
    }).sort({ time: 1 });

    const activeSlot = pendingReminders.length > 0 ? pendingReminders[0].compartment : null;
    const nextAlert = pendingReminders.length > 0 ? pendingReminders[0] : null;

    // Build 6 compartment slots
    const compartments = [1, 2, 3, 4, 5, 6].map(num => {
      const med = medicines.find(m => m.compartment === num);
      const reminder = pendingReminders.find(r => r.compartment === num);
      return {
        slot: num,
        hasMedicine: Boolean(med),
        medicineName: med ? med.name : 'Empty Slot',
        dosage: med ? med.dosage : '',
        isPending: Boolean(reminder),
        isDueNow: activeSlot === num,
        ledState: activeSlot === num ? 'BLINKING_GREEN' : (med ? 'STANDBY' : 'OFF')
      };
    });

    res.json({
      connected: true,
      deviceId: 'MEDIBOX-2026-X8',
      batteryLevel: 94,
      firmware: 'v2.4.1',
      online: true,
      displayTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      activeSlot,
      nextAlert,
      compartments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting smart box status', error: error.message });
  }
});

// @route   POST /api/smartbox/test-alarm
// @desc    Trigger physical box test alarm
router.post('/test-alarm', auth, async (req, res) => {
  res.json({
    message: 'Smart Medicine Box alarm triggered successfully! LED blinking and buzzer sounding.',
    alarmActive: true,
    timestamp: new Date()
  });
});

export default router;

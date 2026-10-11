import express from 'express';
import Reminder from '../models/Reminder.js';
import Medicine from '../models/Medicine.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Helper to get formatted today string YYYY-MM-DD
const getTodayStr = () => new Date().toISOString().split('T')[0];

// @route   GET /api/reminders/today
// @desc    Get today's reminders with stats (Total, Taken, Pending)
router.get('/today', auth, async (req, res) => {
  try {
    const todayStr = getTodayStr();

    // Check if reminders exist for today, if not generate them from active medicines
    let count = await Reminder.countDocuments({ userId: req.user._id, date: todayStr });
    if (count === 0) {
      const activeMeds = await Medicine.find({ userId: req.user._id, active: true });
      for (const med of activeMeds) {
        for (const time of med.reminderTimes) {
          await Reminder.create({
            userId: req.user._id,
            medicineId: med._id,
            medicineName: med.name,
            dosage: med.dosage,
            time: time,
            date: todayStr,
            compartment: med.compartment,
            status: 'Pending',
            notes: med.instructions
          });
        }
      }
    }

    const reminders = await Reminder.find({ userId: req.user._id, date: todayStr }).sort({ time: 1 });

    const total = reminders.length;
    const taken = reminders.filter(r => r.status === 'Taken').length;
    const pending = reminders.filter(r => r.status === 'Pending').length;
    const missed = reminders.filter(r => r.status === 'Missed').length;

    res.json({
      date: todayStr,
      stats: {
        total,
        taken,
        pending,
        missed,
        adherencePercentage: total > 0 ? Math.round((taken / total) * 100) : 0
      },
      reminders
    });
  } catch (error) {
    console.error('Error getting today reminders:', error);
    res.status(500).json({ message: 'Error retrieving today reminders', error: error.message });
  }
});

// @route   GET /api/reminders
// @desc    Get reminders with query params (date, status, limit)
router.get('/', auth, async (req, res) => {
  try {
    const { date, status, limit = 50 } = req.query;
    const filter = { userId: req.user._id };

    if (date) filter.date = date;
    if (status) filter.status = status;

    const reminders = await Reminder.find(filter)
      .sort({ date: -1, time: 1 })
      .limit(Number(limit));

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving reminders', error: error.message });
  }
});

// @route   PATCH /api/reminders/:id/status
// @desc    Update reminder status (e.g. mark as Taken or toggle back to Pending)
router.patch('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'Taken', 'Pending', 'Missed', 'Snoozed'

    const reminder = await Reminder.findOne({ _id: req.params.id, userId: req.user._id });
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    reminder.status = status;
    if (status === 'Taken') {
      reminder.takenAt = new Date();
    } else if (status === 'Pending') {
      reminder.takenAt = null;
    }

    const updated = await reminder.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating reminder status', error: error.message });
  }
});

// @route   POST /api/reminders/mark-taken-by-box
// @desc    Simulate Smart Box physical compartment opening or button press
router.post('/mark-taken-by-box', auth, async (req, res) => {
  try {
    const { compartment } = req.body;
    const todayStr = getTodayStr();

    // Find the pending reminder for this compartment
    const reminder = await Reminder.findOne({
      userId: req.user._id,
      compartment: Number(compartment),
      date: todayStr,
      status: 'Pending'
    });

    if (!reminder) {
      return res.status(404).json({ message: `No pending reminder in compartment ${compartment}` });
    }

    reminder.status = 'Taken';
    reminder.takenAt = new Date();
    await reminder.save();

    res.json({
      message: `Compartment ${compartment} marked as Taken`,
      reminder
    });
  } catch (error) {
    res.status(500).json({ message: 'Error marking taken by box', error: error.message });
  }
});

// @route   GET /api/reminders/stats
// @desc    Get detailed adherence history
router.get('/stats', auth, async (req, res) => {
  try {
    const totalAllTime = await Reminder.countDocuments({ userId: req.user._id });
    const takenAllTime = await Reminder.countDocuments({ userId: req.user._id, status: 'Taken' });

    res.json({
      totalReminders: totalAllTime,
      totalTaken: takenAllTime,
      adherenceRate: totalAllTime > 0 ? Math.round((takenAllTime / totalAllTime) * 100) : 100,
      streakDays: 5
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating stats', error: error.message });
  }
});

export default router;

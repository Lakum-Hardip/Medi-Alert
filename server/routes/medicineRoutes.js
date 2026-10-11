import express from 'express';
import Medicine from '../models/Medicine.js';
import Reminder from '../models/Reminder.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/medicines
// @desc    Get all medicines for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const medicines = await Medicine.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving medicines', error: error.message });
  }
});

// @route   POST /api/medicines
// @desc    Add a new medicine
router.post('/', auth, async (req, res) => {
  try {
    const { name, dosage, frequency, startDate, reminderTimes, compartment, instructions, color } = req.body;

    if (!name || !dosage) {
      return res.status(400).json({ message: 'Medicine name and dosage are required' });
    }

    // Default reminder times if none provided
    let times = reminderTimes;
    if (!times || times.length === 0) {
      if (frequency === 'Twice daily') times = ['08:00 AM', '08:00 PM'];
      else if (frequency === 'Three times daily') times = ['08:00 AM', '02:00 PM', '08:00 PM'];
      else times = ['08:00 AM'];
    }

    const medicine = new Medicine({
      userId: req.user._id,
      name,
      dosage,
      frequency: frequency || 'Once daily',
      startDate: startDate || new Date(),
      reminderTimes: times,
      compartment: compartment || 1,
      instructions: instructions || 'Take with water after food',
      color: color || '#10B981',
      active: true
    });

    const savedMedicine = await medicine.save();

    // Automatically create today's reminders for this new medicine
    const todayStr = new Date().toISOString().split('T')[0];
    for (const time of savedMedicine.reminderTimes) {
      await Reminder.create({
        userId: req.user._id,
        medicineId: savedMedicine._id,
        medicineName: savedMedicine.name,
        dosage: savedMedicine.dosage,
        time: time,
        date: todayStr,
        compartment: savedMedicine.compartment,
        status: 'Pending',
        notes: savedMedicine.instructions
      });
    }

    res.status(201).json(savedMedicine);
  } catch (error) {
    console.error('Error adding medicine:', error);
    res.status(500).json({ message: 'Error adding medicine', error: error.message });
  }
});

// @route   GET /api/medicines/:id
// @desc    Get single medicine details
router.get('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching medicine', error: error.message });
  }
});

// @route   PUT /api/medicines/:id
// @desc    Update a medicine
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, dosage, frequency, reminderTimes, compartment, instructions, color, active } = req.body;

    const medicine = await Medicine.findOne({ _id: req.params.id, userId: req.user._id });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    if (name) medicine.name = name;
    if (dosage) medicine.dosage = dosage;
    if (frequency) medicine.frequency = frequency;
    if (reminderTimes) medicine.reminderTimes = reminderTimes;
    if (compartment !== undefined) medicine.compartment = compartment;
    if (instructions !== undefined) medicine.instructions = instructions;
    if (color) medicine.color = color;
    if (active !== undefined) medicine.active = active;

    const updated = await medicine.save();

    // Update corresponding pending reminders for today with updated name/dosage
    const todayStr = new Date().toISOString().split('T')[0];
    await Reminder.updateMany(
      { medicineId: updated._id, date: todayStr, status: 'Pending' },
      { medicineName: updated.name, dosage: updated.dosage, compartment: updated.compartment }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating medicine', error: error.message });
  }
});

// @route   DELETE /api/medicines/:id
// @desc    Delete a medicine
router.delete('/:id', auth, async (req, res) => {
  try {
    const medicine = await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!medicine) {
      return res.status(404).json({ message: 'Medicine not found' });
    }

    // Delete associated future / today's pending reminders
    await Reminder.deleteMany({ medicineId: req.params.id, status: 'Pending' });

    res.json({ message: 'Medicine deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting medicine', error: error.message });
  }
});

export default router;

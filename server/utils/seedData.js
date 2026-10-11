import User from '../models/User.js';
import Medicine from '../models/Medicine.js';
import Reminder from '../models/Reminder.js';

export const seedInitialData = async () => {
  try {
    let sandip = await User.findOne({ email: 'sandip123@gmail.com' });

    if (!sandip) {
      sandip = new User({
        name: 'Sandip Punani',
        email: 'sandip123@gmail.com',
        password: 'password123',
        mobile: '+91 98765 43210',
        dob: '12 Jan 2000',
        avatar: 'SP',
        notificationSettings: {
          sound: true,
          browser: true,
          boxSync: true,
          emailAlerts: true
        }
      });
      await sandip.save();
      console.log('Seeded default user: Sandip Punani');
    }

    const todayStr = new Date().toISOString().split('T')[0];

    // Check if medicines exist for sandip
    const medicineCount = await Medicine.countDocuments({ userId: sandip._id });
    if (medicineCount === 0) {
      const paracetamol = await Medicine.create({
        userId: sandip._id,
        name: 'Paracetamol',
        dosage: '1 tablet',
        frequency: 'Once daily',
        startDate: new Date(),
        reminderTimes: ['08:00 AM'],
        compartment: 1,
        instructions: 'Take in the morning after breakfast',
        color: '#10B981',
        active: true
      });

      const vitaminD = await Medicine.create({
        userId: sandip._id,
        name: 'Vitamin D',
        dosage: '1 capsule',
        frequency: 'Once daily',
        startDate: new Date(),
        reminderTimes: ['12:00 PM'],
        compartment: 2,
        instructions: 'Take at midday with lunch',
        color: '#F59E0B',
        active: true
      });

      const calcium = await Medicine.create({
        userId: sandip._id,
        name: 'Calcium',
        dosage: '1 tablet',
        frequency: 'Once daily',
        startDate: new Date(),
        reminderTimes: ['08:00 PM'],
        compartment: 3,
        instructions: 'Take after dinner before sleep',
        color: '#EF4444',
        active: true
      });

      // Create Today's reminders matching the reference image!
      await Reminder.create([
        {
          userId: sandip._id,
          medicineId: paracetamol._id,
          medicineName: 'Paracetamol',
          dosage: '1 tablet',
          time: '08:00 AM',
          date: todayStr,
          compartment: 1,
          status: 'Taken',
          takenAt: new Date(new Date().setHours(8, 15, 0, 0)),
          notes: 'Taken on time'
        },
        {
          userId: sandip._id,
          medicineId: vitaminD._id,
          medicineName: 'Vitamin D',
          dosage: '1 capsule',
          time: '12:00 PM',
          date: todayStr,
          compartment: 2,
          status: 'Pending',
          notes: 'Scheduled for lunch'
        },
        {
          userId: sandip._id,
          medicineId: calcium._id,
          medicineName: 'Calcium',
          dosage: '1 tablet',
          time: '08:00 PM',
          date: todayStr,
          compartment: 3,
          status: 'Pending',
          notes: 'Scheduled for dinner'
        }
      ]);

      console.log('Seeded default medicines and reminders for Sandip Punani!');
    } else {
      // Ensure today's reminders exist
      const todayRemindersCount = await Reminder.countDocuments({ userId: sandip._id, date: todayStr });
      if (todayRemindersCount === 0) {
        const medicines = await Medicine.find({ userId: sandip._id, active: true });
        for (const med of medicines) {
          for (const time of med.reminderTimes) {
            await Reminder.create({
              userId: sandip._id,
              medicineId: med._id,
              medicineName: med.name,
              dosage: med.dosage,
              time: time,
              date: todayStr,
              compartment: med.compartment,
              status: med.name === 'Paracetamol' ? 'Taken' : 'Pending',
              takenAt: med.name === 'Paracetamol' ? new Date() : null
            });
          }
        }
        console.log(`Generated today's reminders for ${medicines.length} medicines.`);
      }
    }
  } catch (err) {
    console.error('Seeding error:', err);
  }
};

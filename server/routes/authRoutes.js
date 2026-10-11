import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';
import { seedInitialData } from '../utils/seedData.js';

const router = express.Router();

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'medialert_secret_2026', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, mobile, dob } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const initials = name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';

    const user = new User({
      name,
      email,
      password,
      mobile: mobile || '+91 98765 43210',
      dob: dob || '12 Jan 2000',
      avatar: initials
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        avatar: user.avatar,
        notificationSettings: user.notificationSettings
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: error.message || 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        avatar: user.avatar,
        notificationSettings: user.notificationSettings
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        mobile: req.user.mobile,
        dob: req.user.dob,
        avatar: req.user.avatar,
        notificationSettings: req.user.notificationSettings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, mobile, dob, notificationSettings } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) {
      user.name = name;
      user.avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    if (mobile !== undefined) user.mobile = mobile;
    if (dob !== undefined) user.dob = dob;
    if (notificationSettings !== undefined) {
      user.notificationSettings = { ...user.notificationSettings, ...notificationSettings };
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        dob: user.dob,
        avatar: user.avatar,
        notificationSettings: user.notificationSettings
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// @route   POST /api/auth/seed
// @desc    Reset or Seed Sandip Punani default demo data
router.post('/seed', async (req, res) => {
  try {
    await seedInitialData();
    res.json({ message: 'Demo data reseeded successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error seeding data' });
  }
});

export default router;

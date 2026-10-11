import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // If demo mode header or no token, find or create default Sandip Punani user
      let demoUser = await User.findOne({ email: 'sandip123@gmail.com' });
      if (demoUser) {
        req.user = demoUser;
        return next();
      }
      return res.status(401).json({ message: 'No authentication token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medialert_secret_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found or token invalid' });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    // If token expired but demo user exists, fallback gracefully
    let demoUser = await User.findOne({ email: 'sandip123@gmail.com' });
    if (demoUser) {
      req.user = demoUser;
      return next();
    }
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

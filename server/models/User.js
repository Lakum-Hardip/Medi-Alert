import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Sandip Punani'
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  mobile: {
    type: String,
    default: '+91 98765 43210'
  },
  dob: {
    type: String,
    default: '12 Jan 2000'
  },
  avatar: {
    type: String,
    default: 'SP'
  },
  notificationSettings: {
    sound: { type: Boolean, default: true },
    browser: { type: Boolean, default: true },
    boxSync: { type: Boolean, default: true },
    emailAlerts: { type: Boolean, default: false }
  }
}, { timestamps: true });

// Password hashing before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;

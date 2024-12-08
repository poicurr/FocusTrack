const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  workTime: {
    type: Number,
    default: 25
  },

  shortBreakTime: {
    type: Number,
    default: 5
  },

  longBreakTime: {
    type: Number,
    default: 15
  },

  notificationsEnabled: {
    type: Boolean,
    default: true
  },

  primaryColor: {
    type: String,
    default: '#3f51b5'
  },

  secondaryColor: {
    type: String,
    default: '#f50057'
  },

  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light'
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },

  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
  
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

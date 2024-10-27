const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
  pomodoroDuration: { type: Number, default: 25 },
  breakDuration: { type: Number, default: 5 },
  longBreakDuration: { type: Number, default: 15 },
  longBreakInterval: { type: Number, default: 4 },
  notificationsEnabled: { type: Boolean, default: true },
  theme: { type: String, default: 'light' }
});

module.exports = mongoose.model('Settings', settingsSchema);

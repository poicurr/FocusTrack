const mongoose = require('mongoose');

const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  endpoint: { type: String, required: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true }
  }
});

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);

const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['Basic', 'Premium', 'Ultimate']
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Duration in months
    required: true
  },
  features: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Subscription', subscriptionSchema); 
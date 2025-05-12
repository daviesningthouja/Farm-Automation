const mongoose = require('mongoose');

const relaySchema = new mongoose.Schema({
  relayId: {
    type: Number,
    required: true,
  },
  state: {
    type: Number, // 0 = OFF, 1 = ON
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('RelayLog', relaySchema);

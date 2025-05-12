const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  temp: {
    type: Number,
    required: true,
  },
  soil: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
  
  module.exports =  mongoose.model("TempData", temperatureSchema);
// src/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  },
  appName: { type: String }, // ej: "MindBang Admin", "Mobile App"
  ipAddress: { type: String },
  userAgent: { type: String },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date },
  lastActivity: { type: Date },
  isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Session', sessionSchema);

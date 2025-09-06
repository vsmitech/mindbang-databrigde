// src/models/Client.js
const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true }, // identificador técnico
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    metadata: {
        contactEmail: String,
        website: String,
        notes: String
    }
});

module.exports = mongoose.model('Client', clientSchema);

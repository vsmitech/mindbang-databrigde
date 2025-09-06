const mongoose = require('mongoose');

const appSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    description: {  
        type: String, 
        required: false,
        trim: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('App', appSchema);
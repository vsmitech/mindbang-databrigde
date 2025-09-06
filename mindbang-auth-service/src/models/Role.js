const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        unique: true
    },
    isSystem: {
        type: Boolean, 
        default: false
    },
}, {
    timestamps: true
}

);
module.exports = mongoose.model('Role', roleSchema);

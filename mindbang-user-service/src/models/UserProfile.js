// src/models/UserProfile.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userProfileSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,    
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    type: String,
    trim: true
  },
  OrganizationId: {
    type: String,    
    required: false,
    desc: 'ID de la organización a la que pertenece el usuario desde servicio de autenticación'
  },
  roles: {
    type: [String],
    validate: {
      validator: arr => arr.length > 0,
      message: 'Debe tener al menos un rol asignado'
    },
    desc: 'Roles asignados al usuario desde servicio de autenticación'
  },
  preferences: {
    language: { type: String, default: 'es' },
    theme: { type: String, default: 'light' }
  },
  lastLogin: {
    type: Date
  },
  activeSessions: [{
    type: Schema.Types.ObjectId,
    ref: 'Session'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false
});

// 🔐 Método para ocultar campos sensibles
userProfileSchema.methods.toJSON = function () {
  const obj = this.toObject();
  //delete obj.__v;
  return obj;
};

module.exports = mongoose.model('UserProfile', userProfileSchema);

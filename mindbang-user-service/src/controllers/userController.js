// src/controllers/userController.js
const UserProfile = require('../models/UserProfile');
const userProfileService = require('../services/userProfileService');
const Client = require('../models/Client');
const Session = require('../models/Session'); // Registro de sesiones

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const profile = await userProfileService.findOne(userId);
    if (!profile) {
      console.log(`Perfil no encontrado para userId: ${userId}`);
      return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
    }
    res.status(200).json({ success: true, profile });
  } catch (error) {
    next(error);
  }
};
exports.updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const profile = userProfileService.update(userId,updateData);
    if (!profile) { 
      return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Perfil actualizado', profile });
  } catch (error) {
    next(error);
  }
};

exports.syncUserProfile = async (req, res, next) => {
  try {    
    const { userId, fullName, position,preferences, organizationId,email,roles} = req.body;
    return userProfileService.sync(userId,fullName,position,preferences,organizationId,email,roles);
  } catch (error) {
    next(error);
  }
};

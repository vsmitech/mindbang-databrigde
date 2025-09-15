// src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');

exports.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Espera formato "Bearer <token>"
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Opcional: cargar perfil completo desde DB
    //const profile = await UserProfile.findById(decoded.id).populate('client');
    //if (!profile) {
      //return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    //}

    // Revisar si applica mas adelante
    //req.profile = profile; // Enrutador puede acceder a perfil completo
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
  }
};

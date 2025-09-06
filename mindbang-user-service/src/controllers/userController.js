// src/controllers/userController.js
const UserProfile = require('../models/UserProfile');
const Client = require('../models/Client');
const Session = require('../models/Session'); // Registro de sesiones

exports.syncUserProfile = async (req, res, next) => {
  try {
    const { userId, fullName, email, clientCode, roles } = req.body;

    // Buscar cliente por código
    const client = await Client.findOne({ code: clientCode });
    if (!client) {
      return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }

    // Buscar perfil existente
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Crear nuevo perfil
      profile = new UserProfile({
        userId,
        fullName,
        email,
        clientId: client._id,
        roles: roles || ['viewer'],
        lastLogin: new Date()
      });
      await profile.save();
    } else {
      // Actualizar login
      profile.lastLogin = new Date();
      await profile.save();
    }

    // Registrar sesión activa
    const session = new Session({
      userId: profile._id,
      clientId: client._id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      app: req.headers['x-app-name'] || 'web' // Permite trazabilidad por origen
    });
    await session.save();

    return res.status(profile.isNew ? 201 : 200).json({
      success: true,
      message: profile.isNew ? 'Perfil creado' : 'Perfil sincronizado',
      profile,
      sessionId: session._id
    });
  } catch (error) {
    next(error);
  }
};

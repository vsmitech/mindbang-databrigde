
import UserProfile from '../models/UserProfile.js';
import Client from '../models/Client.js';
import Session from '../models/Session.js';

export async function findOne(userId){   
    const profile = await UserProfile.findOne({userId}).populate('organizationId', 'name code');
    return profile;
}

export async function update(userId,updateData){
    const profile = await UserProfile.findOneAndUpdate({ userId }, updateData, { new: true }).populate('organizationId', 'name code');
    return profile;
}

export async function sync (userId, fullName, position,preferences, organizationId,email,roles){
  try {        

    // Buscar cliente por código
    const client = await Client.findOne({ code: organizationId });
    if (!client) {
      console.log(`Cliente no encontrado para organizationId: ${organizationId}`);
      //return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
    }
    // Buscar perfil existente
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Crear nuevo perfil
      profile = new UserProfile({
        userId,
        fullName,
        email,
        position,
        clientId: client ? client._id : null,
        roles: roles || ['viewer'],
        lastLogin: new Date(),
        preferences: preferences || { language: 'es', theme: 'light' }
      });
      profile = await profile.save();
    } else {
      // Actualizar login
      profile.fullName = fullName || profile.fullName;
      profile.email = email || profile.email;
      profile.position = position || profile.position;
      profile.clientId = client ? client._id : profile.clientId;
      profile.roles = roles || profile.roles;
      profile.preferences = preferences || profile.preferences;
      profile.lastLogin = new Date();
      profile = await profile.save();
    }

    // Registrar sesión activa
    console.log('Registrando sesión');

    const session = new Session({
      userId: profile._id,
      clientId: client ? client._id : null,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      app: req.headers['x-app-name'] || 'web' // Permite trazabilidad por origen
    });
    await session.save();
    console.log('Session guardada :',session._id);

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

export const userProfileService  = {
    update,
    sync,
    findOne
};

export default userProfileService;
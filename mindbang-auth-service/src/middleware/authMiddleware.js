const JWT = require('jsonwebtoken');
const User = require('../models/User');

exports.verifyToken = async (req, res, next) => {
   
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado Authorization    
    if (!token) {        
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        // Busca al usuario en la base de datos y popula sus roles para obtener los nombres
        const user = await User.findById(decoded._id).populate('roles');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }       
        // Adjunta el objeto de usuario completo (con los roles populados) a la solicitud
        req.user = user; 
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Middleware para verificar rol requerido
exports.requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      console.log('No user or roles information available in request');
      console.log('No hay información de roles en el token');      
      return res.status(403).json({ message: 'No role information available' });
    }

    const userRoles = req.user.roles.map(role => role.role);
    const hasAccess = requiredRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      console.log('Access denied. User roles:', userRoles, 'Required roles:', requiredRoles);
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }
    next();
  };
};
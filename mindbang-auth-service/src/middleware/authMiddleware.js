const JWT = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
   
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del encabezado Authorization
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Agregar la información del usuario al objeto de la solicitud 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};


// Middleware para verificar rol requerido
exports.requireRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'No role information available' });
    }

    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const hasAccess = requiredRoles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied: insufficient role' });
    }

    next();
  };
};
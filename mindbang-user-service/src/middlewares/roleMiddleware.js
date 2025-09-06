// src/middlewares/roleMiddleware.js
exports.requireRole = (roles = []) => {
  return (req, res, next) => {
    const userRole = req.profile?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado: se requiere uno de los roles [${roles.join(', ')}]`
      });
    }

    next();
  };
};

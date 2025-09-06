module.exports = function(roles =[]) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        // Map de los objetos de rol a un array de strings (los nombres de los roles)
        const userRoleNames = req.user.roles.map(role => role.role);
        
        // Verificar si el usuario tiene al menos uno de los roles requeridos
        const hasRequiredRole = requiredRoles.some(role => userRoleNames.includes(role));

        if(hasRequiredRole){
            next();
        }
        else{
            return res.status(403).json({ message: 'Forbidden: insufficient role' });
        }                
    };
}   
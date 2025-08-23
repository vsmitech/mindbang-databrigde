module.exports = function(roles =[]) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        if (roles.length && !roles.includes(req.user.roles)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
}   
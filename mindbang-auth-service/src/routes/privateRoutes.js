const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');



router.get('/profile', authMiddleware.verifyToken, authController.getProfile);
router.get('/admin', authMiddleware.verifyToken, roleMiddleware(['admin']), (req, res) => {
    res.send('Admin content');
});

const adminRoles = ['admin', 'sys-admin'];
/* Rutas para la gestión de roles (solo para admins) */
router.post('/create-role', authMiddleware.verifyToken, roleMiddleware(adminRoles), adminController.createRole);
router.put('/update-role', authMiddleware.verifyToken, roleMiddleware(adminRoles), adminController.updateRole);
router.delete('/delete-role', authMiddleware.verifyToken, roleMiddleware(adminRoles), adminController.deleteRole);
router.get('/roles', authMiddleware.verifyToken, roleMiddleware(adminRoles), adminController.listRoles);
router.get('/role/:id', authMiddleware.verifyToken, roleMiddleware(adminRoles), adminController.getRoleById);



module.exports = router;
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {verifyToken, requireRole} = require('../middleware/authMiddleware');


//Ruta para login de usuario
router.post('/login', authController.login);

//Gestion de sesion (logout) - opcional en JWT
router.post('/logout', verifyToken, authController.logout);
router.post('/refresh', authController.refreshToken);
router.get('/me', verifyToken, authController.getCurrentUser);

//Recuperación y cambio de contraseña
router.post('/forgot-password', authController.forgotPassword); 
router.post('/reset-password', authController.resetPassword);
router.post('/change-password', verifyToken, authController.changePassword);

//Verificación de email (por token)
router.get('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);

//Roles y permisos
router.get('/roles', verifyToken, authController.listRoles);

const adminRoles = ['admin', 'sys-admin'];

// Administración de usuarios (solo para admins)
router.get('/users', verifyToken, requireRole(adminRoles), authController.getAllUsers);
router.get('/users/:id', verifyToken, requireRole(adminRoles), authController.getUserById);
router.put('/users/:id', verifyToken, requireRole(adminRoles), authController.updateUser);
router.delete('/users/:id', verifyToken, requireRole(adminRoles), authController.deleteUser);
router.post('/users',verifyToken,requireRole(adminRoles), authController.register);


module.exports = router;
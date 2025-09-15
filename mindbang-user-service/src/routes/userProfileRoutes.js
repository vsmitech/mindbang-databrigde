// src/routes/userRoutes.js
const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Sincronización de perfil desde auth-service
router.post('/user', verifyToken, userController.syncUserProfile);
router.get('/user/:id', verifyToken, userController.getUserProfile);
router.put('/user/:id', verifyToken, userController.updateUserProfile);


module.exports = router;

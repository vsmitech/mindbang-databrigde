// src/routes/userRoutes.js
const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Sincronización de perfil desde auth-service
router.post('/sync', verifyToken, userController.syncUserProfile);

module.exports = router;

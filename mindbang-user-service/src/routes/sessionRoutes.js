// src/routes/sessionRoutes.js
const router = require('express').Router();
const sessionController = require('../controllers/sessionController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/start', verifyToken, sessionController.registerSession);
router.put('/end/:sessionId', verifyToken, sessionController.endSession);
router.get('/active', verifyToken, sessionController.getActiveSessions);

module.exports = router;

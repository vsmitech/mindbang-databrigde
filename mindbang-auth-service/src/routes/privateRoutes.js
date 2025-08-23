const express = require('express');
const router = express.Router();    
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {getProfile} = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.send('Admin content');
});

module.exports = router;
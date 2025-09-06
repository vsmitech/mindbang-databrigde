// src/routes/clientRoutes.js
const router = require('express').Router();
const clientController = require('../controllers/clientController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

// Solo admins pueden gestionar clientes
router.post('/', verifyToken, requireRole(['admin']), clientController.createClient);
router.get('/', verifyToken, requireRole(['admin']), clientController.getClients);
router.get('/:id', verifyToken, requireRole(['admin']), clientController.getClientById);
router.put('/:id', verifyToken, requireRole(['admin']), clientController.updateClient);
router.delete('/:id', verifyToken, requireRole(['admin']), clientController.deleteClient);

module.exports = router;

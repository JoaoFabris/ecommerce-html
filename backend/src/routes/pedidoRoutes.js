const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', auth, isAdmin, pedidoController.listar);
router.get('/:id', auth, pedidoController.buscarPorId);
router.post('/', auth, pedidoController.criar);
router.put('/:id', auth, isAdmin, pedidoController.atualizarStatus);
router.delete('/:id', auth, isAdmin, pedidoController.deletar);

module.exports = router;
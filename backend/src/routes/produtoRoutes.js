const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', produtoController.listar);
router.get('/:id', produtoController.buscarPorId);
router.post('/', auth, isAdmin, produtoController.criar);
router.put('/:id', auth, isAdmin, produtoController.atualizar);
router.delete('/:id', auth, isAdmin, produtoController.deletar);

module.exports = router;
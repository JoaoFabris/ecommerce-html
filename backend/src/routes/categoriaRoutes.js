const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');

router.get('/', categoriaController.listar);
router.get('/:id', categoriaController.buscarPorId);
router.post('/', auth, isAdmin, categoriaController.criar);
router.put('/:id', auth, isAdmin, categoriaController.atualizar);
router.delete('/:id', auth, isAdmin, categoriaController.deletar);

module.exports = router;
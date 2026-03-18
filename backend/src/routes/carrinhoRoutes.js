const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const auth = require('../middlewares/auth');

router.get('/', auth, carrinhoController.buscar);
router.post('/adicionar', auth, carrinhoController.adicionar);
router.delete('/remover/:produtoId', auth, carrinhoController.remover);
router.delete('/limpar', auth, carrinhoController.limpar);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');


router.post('/registrar', userController.registrar);
router.post('/login', userController.login);
router.get('/', auth, isAdmin, userController.listar);
router.delete('/:id', auth, isAdmin, userController.deletar)

module.exports = router;
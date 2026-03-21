const express = require('express');
const router = express.Router();
const carrinhoController = require('../controllers/carrinhoController');
const auth = require('../middlewares/auth');

/**
 * @swagger
 * /api/carrinho:
 *   get:
 *     summary: Ver carrinho do usuário
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho do usuário logado
 *       401:
 *         description: Token não fornecido
 */
router.get('/', auth, carrinhoController.buscar);

/**
 * @swagger
 * /api/carrinho/adicionar:
 *   post:
 *     summary: Adicionar item ao carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Carrinho'
 *     responses:
 *       200:
 *         description: Item adicionado ao carrinho
 *       400:
 *         description: Estoque insuficiente
 */
router.post('/adicionar', auth, carrinhoController.adicionar);

/**
 * @swagger
 * /api/carrinho/remover/{produtoId}:
 *   delete:
 *     summary: Remover item do carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: produtoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removido
 *       400:
 *         description: Carrinho não encontrado
 */
router.delete('/remover/:produtoId', auth, carrinhoController.remover);

/**
 * @swagger
 * /api/carrinho/limpar:
 *   delete:
 *     summary: Limpar carrinho
 *     tags: [Carrinho]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Carrinho limpo com sucesso
 */
router.delete('/limpar', auth, carrinhoController.limpar);

module.exports = router;
const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const paginacao = require('../middlewares/paginacao');
const { validarPedido, validarStatus } = require('../middlewares/validacoes');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Listar todos os pedidos (admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Itens por página
 *     responses:
 *       200:
 *         description: Lista paginada de pedidos
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get('/', auth, isAdmin, paginacao, pedidoController.listar);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Buscar pedido por ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', auth, pedidoController.buscarPorId);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Criar pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Estoque insuficiente ou erro de validação
 */
router.post('/', auth, validarPedido, validar, pedidoController.criar);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Atualizar status do pedido (admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendente, enviado, entregue, cancelado]
 *                 example: enviado
 *     responses:
 *       200:
 *         description: Status atualizado
 *       400:
 *         description: Status inválido
 */
router.put('/:id', auth, isAdmin, validarStatus, validar, pedidoController.atualizarStatus);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Deletar pedido (admin)
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedido removido com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', auth, isAdmin, pedidoController.deletar);

module.exports = router;
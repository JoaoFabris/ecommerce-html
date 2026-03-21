const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const paginacao = require('../middlewares/paginacao');
const { validarProduto } = require('../middlewares/validacoes');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Listar produtos com paginação
 *     tags: [Produtos]
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
 *         description: Lista paginada de produtos
 */
router.get('/', paginacao, produtoController.listar);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Buscar produto por ID
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Produto encontrado
 *       404:
 *         description: Produto não encontrado
 */
router.get('/:id', produtoController.buscarPorId);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Criar produto (admin)
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       201:
 *         description: Produto criado
 *       400:
 *         description: Erro de validação
 *       403:
 *         description: Acesso restrito a administradores
 */
router.post('/', auth, isAdmin, validarProduto, validar, produtoController.criar);

/**
 * @swagger
 * /api/produtos/{id}:
 *   put:
 *     summary: Atualizar produto (admin)
 *     tags: [Produtos]
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
 *             $ref: '#/components/schemas/Produto'
 *     responses:
 *       200:
 *         description: Produto atualizado
 *       404:
 *         description: Produto não encontrado
 */
router.put('/:id', auth, isAdmin, validarProduto, validar, produtoController.atualizar);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Deletar produto (admin)
 *     tags: [Produtos]
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
 *         description: Produto removido
 *       404:
 *         description: Produto não encontrado
 */
router.delete('/:id', auth, isAdmin, produtoController.deletar);

module.exports = router;
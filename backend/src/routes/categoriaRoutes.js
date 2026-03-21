const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { validarCategoria } = require('../middlewares/validacoes');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Listar todas as categorias
 *     tags: [Categorias]
 *     responses:
 *       200:
 *         description: Lista de categorias
 */
router.get('/', categoriaController.listar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Buscar categoria por ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria encontrada
 *       404:
 *         description: Categoria não encontrada
 */
router.get('/:id', categoriaController.buscarPorId);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Criar categoria (admin)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Categoria criada
 *       400:
 *         description: Categoria já cadastrada ou erro de validação
 *       403:
 *         description: Acesso restrito a administradores
 */
router.post('/', auth, isAdmin, validarCategoria, validar, categoriaController.criar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   put:
 *     summary: Atualizar categoria (admin)
 *     tags: [Categorias]
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
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Categoria atualizada
 *       404:
 *         description: Categoria não encontrada
 */
router.put('/:id', auth, isAdmin, validarCategoria, validar, categoriaController.atualizar);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Deletar categoria (admin)
 *     tags: [Categorias]
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
 *         description: Categoria removida
 *       404:
 *         description: Categoria não encontrada
 */
router.delete('/:id', auth, isAdmin, categoriaController.deletar);

module.exports = router;
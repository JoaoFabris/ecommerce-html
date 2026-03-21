const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');
const isAdmin = require('../middlewares/isAdmin');
const { validarUser, validarLogin } = require('../middlewares/validacoes');
const validar = require('../middlewares/validar');

/**
 * @swagger
 * /api/users/registrar:
 *   post:
 *     summary: Registrar novo usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Email já cadastrado ou erro de validação
 */
router.post('/registrar', validarUser, validar, userController.registrar);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login do usuário
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, senha]
 *             properties:
 *               email:
 *                 type: string
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login realizado, retorna token JWT
 *       401:
 *         description: Email ou senha inválidos
 */
router.post('/login', validarLogin, validar, userController.login);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Listar todos os usuários (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Token não fornecido
 *       403:
 *         description: Acesso restrito a administradores
 */
router.get('/', auth, isAdmin, userController.listar);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar dados do usuário
 *     tags: [Users]
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
 *               nome:
 *                 type: string
 *               endereco:
 *                 type: object
 *                 properties:
 *                   logradouro:
 *                     type: string
 *                   bairro:
 *                     type: string
 *                   localidade:
 *                     type: string
 *                   uf:
 *                     type: string
 *                   cep:
 *                     type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', auth, userController.atualizar);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar usuário (admin)
 *     tags: [Users]
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
 *         description: Usuário removido com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', auth, isAdmin, userController.deletar);

/**
 * @swagger
 * /api/users/favoritos:
 *   get:
 *     summary: Listar produtos favoritos do usuário
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de favoritos
 */
router.get('/favoritos', auth, userController.listarFavoritos);

/**
 * @swagger
 * /api/users/favoritos/{produtoId}:
 *   post:
 *     summary: Adicionar produto aos favoritos
 *     tags: [Users]
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
 *         description: Produto adicionado aos favoritos
 *       400:
 *         description: Produto já está nos favoritos
 */
router.post('/favoritos/:produtoId', auth, userController.adicionarFavorito);

/**
 * @swagger
 * /api/users/favoritos/{produtoId}:
 *   delete:
 *     summary: Remover produto dos favoritos
 *     tags: [Users]
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
 *         description: Produto removido dos favoritos
 */
router.delete('/favoritos/:produtoId', auth, userController.removerFavorito);

module.exports = router;

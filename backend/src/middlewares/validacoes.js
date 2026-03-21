const { body } = require('express-validator');

const validarUser = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter no mínimo 6 caracteres'),
];

const validarLogin = [
  body('email').isEmail().withMessage('Email inválido'),
  body('senha').notEmpty().withMessage('Senha é obrigatória'),
];

const validarProduto = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('preco').isFloat({ min: 0 }).withMessage('Preço deve ser um número positivo'),
  body('categoria').notEmpty().withMessage('Categoria é obrigatória'),
  body('quantidade').isInt({ min: 0 }).withMessage('Quantidade deve ser um número inteiro positivo'),
];

const validarCategoria = [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
];

const validarPedido = [
  body('produto').notEmpty().withMessage('Produto é obrigatório'),
  body('quantidade').isInt({ min: 1 }).withMessage('Quantidade mínima é 1'),
  body('endereco.uf').notEmpty().withMessage('UF do endereço é obrigatória'),
];

const validarStatus = [
  body('status')
    .isIn(['pendente', 'enviado', 'entregue', 'cancelado'])
    .withMessage('Status inválido'),
];

module.exports = {
  validarUser,
  validarLogin,
  validarProduto,
  validarCategoria,
  validarPedido,
  validarStatus,
};
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Gestão de Vendas API',
      version: '1.0.0',
      description: 'API REST com autenticação JWT, CRUD completo de produtos, categorias, carrinho e pedidos',
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            nome: { type: 'string', example: 'João Fabris' },
            email: { type: 'string', example: 'joao@email.com' },
            senha: { type: 'string', example: '123456' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
          },
        },
        Produto: {
          type: 'object',
          required: ['nome', 'preco', 'categoria', 'quantidade'],
          properties: {
            nome: { type: 'string', example: 'Notebook' },
            preco: { type: 'number', example: 3500 },
            categoria: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            quantidade: { type: 'number', example: 10 },
            img: { type: 'string', example: 'assets/notebook.png' },
          },
        },
        Categoria: {
          type: 'object',
          required: ['nome'],
          properties: {
            nome: { type: 'string', example: 'Eletrônicos' },
            descricao: { type: 'string', example: 'Produtos eletrônicos em geral' },
          },
        },
        Carrinho: {
          type: 'object',
          properties: {
            produtoId: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' },
            quantidade: { type: 'number', example: 2 },
          },
        },
        Pedido: {
          type: 'object',
          required: ['produto', 'quantidade', 'endereco'],
          properties: {
            produto: {
              type: 'object',
              properties: { id: { type: 'string', example: '64a1b2c3d4e5f6a7b8c9d0e1' } },
            },
            quantidade: { type: 'number', example: 1 },
            endereco: {
              type: 'object',
              properties: {
                logradouro: { type: 'string', example: 'Rua Teste' },
                bairro: { type: 'string', example: 'Centro' },
                localidade: { type: 'string', example: 'Rio de Janeiro' },
                uf: { type: 'string', example: 'RJ' },
                cep: { type: 'string', example: '20000-000' },
              },
            },
            frete: { type: 'number', example: 15 },
          },
        },
      },
    },
  },
  apis: ['./backend/src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
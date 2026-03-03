const express = require('express');
const path = require('path');

const ProdutoService = require('./backend/src/services/produtoService');
const PedidoService = require('./backend/src/services/pedidoService');
const { buscarCep } = require('./backend/src/services/cepService');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/api', (req, res) => res.json({ mensagem: 'Servidor funcionando!' }));

app.get('/api/produtos', (req, res) => {
  try {
    const service = new ProdutoService();
    res.json(service.listarTodos());
  } catch (error) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/api/cep/:cep', async (req, res) => {
  try {
    const data = await buscarCep(req.params.cep); //busca  pela api dentro do back
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/api/pedidos', (req, res) => {
  try {
    const { produto, quantidade } = req.body;

    if (!produto || !quantidade) {
      return res
        .status(400)
        .json({ error: 'Produto e quantidade são obrigatórios' });
    }

    const service = new PedidoService();
    const pedido = service.criar(produto, quantidade);

    res.status(201).json(pedido);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/pedidos', async (req, res) => {
  try {
    const service = new PedidoService();
    return res.json(service.listaTodosOsPedidos());
  } catch (error) {
    res.status(400).json({ error: error.mensagem });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

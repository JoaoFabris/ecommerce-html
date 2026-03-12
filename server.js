const express = require('express');
const path = require('path');

const produtoRoutes = require('./backend/src/routes/produtoRoutes');
const pedidoRoutes = require('./backend/src/routes/pedidoRoutes');
const { buscarCep } = require('./backend/src/services/cepService');

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/api', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

// Produtos via MVC
app.use('/api/produtos', produtoRoutes);

// Pedidos via MVC
app.use('/api/pedidos', pedidoRoutes);

// CEP
app.get('/api/cep/:cep', async (req, res) => {
  try {
    const data = await buscarCep(req.params.cep);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));




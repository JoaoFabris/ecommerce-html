require('dotenv').config();
// Carrega as variáveis do arquivo .env para o process.env. Sem isso, o process.env.MONGO_URI seria undefined e a conexão falharia.

const express = require('express');
const path = require('path');
const cors = require('cors');
// Permite que o front-end (ou Thunder Client) faça requisições para a API sem ser bloqueado pelo navegador. Sem isso, requests de origens diferentes seriam rejeitados.

const conectarDB = require('./backend/src/config/db');
// Importa e executa a função de conexão com o MongoDB Atlas assim que o servidor sobe. O db.js usa o process.env.MONGO_URI que foi carregado pelo dotenv.

const produtoRoutes = require('./backend/src/routes/produtoRoutes');
const pedidoRoutes = require('./backend/src/routes/pedidoRoutes');
const userRoutes = require('./backend/src/routes/userRoutes');
const categoriaRoutes = require('./backend/src/routes/categoriaRoutes');
const { buscarCep } = require('./backend/src/services/cepService');

const app = express();

conectarDB();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

app.get('/api', (req, res) => {
  res.json({ mensagem: 'Servidor funcionando!' });
});

app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/users', userRoutes);

app.get('/api/cep/:cep', async (req, res) => {
  try {
    const data = await buscarCep(req.params.cep);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
// Em vez de fixar a porta como 3000, lê do .env. O || 3000 é um fallback — se não tiver no .env, usa 3000. Isso é importante para quando subir em produção (o serviço define a porta automaticamente).

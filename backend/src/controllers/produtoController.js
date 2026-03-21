//recebe a req e retorna o status code

const ProdutoService = require('../services/produtoService');
const service = new ProdutoService();

async function listar(req, res) {
  try {
    const resultado = await service.listarTodos(req.paginacao);
    res.json(resultado);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const produto = await service.buscarPorId(req.params.id);
    res.json(produto);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function criar(req, res) {
  try {
    const produto = await service.criar(req.body);
    res.status(201).json(produto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function atualizar(req, res) {
  try {
    const produto = await service.atualizar(req.params.id, req.body);
    res.json(produto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function deletar(req, res) {
  try {
    await service.deletar(req.params.id);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
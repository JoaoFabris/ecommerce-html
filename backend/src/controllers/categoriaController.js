const CategoriaService = require('../services/categoriaService');
const service = new CategoriaService();

async function listar(req, res) {
  try {
    const categorias = await service.listarTodos();
    res.json(categorias);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function buscarPorId(req, res) {
  try {
    const categoria = await service.buscarPorId(req.params.id);
    res.json(categoria);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function criar(req, res) {
  try {
    const categoria = await service.criar(req.body);
    res.status(201).json(categoria);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function atualizar(req, res) {
  try {
    const categoria = await service.atualizar(req.params.id, req.body);
    res.json(categoria);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function deletar(req, res) {
  try {
    await service.deletar(req.params.id);
    res.json({ mensagem: 'Categoria removida com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizar, deletar };
//recebe a req e retorna o status code
const PedidoService = require('../services/pedidoService');
const service = new PedidoService();

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
    const pedido = await service.buscarPorId(req.params.id);
    res.json(pedido);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
}

async function criar(req, res) {
  try {
    const { produto, quantidade, endereco, frete } = req.body;
    const pedido = await service.criar({
      usuarioId: req.user.id,
      produto,
      quantidade,
      endereco,
      frete,
    });
    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function atualizarStatus(req, res) {
  try {
    const pedido = await service.atualizarStatus(req.params.id, req.body.status);
    res.json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function deletar(req, res) {
  try {
    await service.deletar(req.params.id);
    res.json({ mensagem: 'Pedido removido com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { listar, buscarPorId, criar, atualizarStatus, deletar };
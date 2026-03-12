//recebe a req e retorna o status code

const PedidoService = require('../services/pedidoService');

function listar(req, res) {
  try {
    const service = new PedidoService();
    const pedidos = service.listaTodosOsPedidos();
    res.json(pedidos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function buscarPorId(req, res) {
  try {
    const service = new PedidoService();
    const pedido = service.buscarPorId(req.params.id);

    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(pedido);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function criar(req, res) {
  try {
    const { produto, quantidade, endereco, frete } = req.body;

    if (!produto || !quantidade) {
      return res.status(400).json({
        error: 'Produto e quantidade são obrigatórios'
      });
    }

    const service = new PedidoService();
    const pedido = service.criar(produto, quantidade, endereco, frete);

    res.status(201).json(pedido);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function atualizar(req, res) {
  try {
    const service = new PedidoService();
    const pedidoAtualizado = service.atualizar(req.params.id, req.body);

    res.json(pedidoAtualizado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function deletar(req, res) {
  try {
    const service = new PedidoService();
    service.deletar(req.params.id);

    res.json({ mensagem: 'Pedido removido com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar
};
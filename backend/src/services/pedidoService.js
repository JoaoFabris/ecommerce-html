const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');

class PedidoService {
  async listarTodos({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const total = await Pedido.countDocuments();
    const pedidos = await Pedido.find()
      .populate('usuario', 'nome email')
      .populate('itens.produto', 'nome preco img')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    return { pedidos, total, page, totalPages: Math.ceil(total / limit) };
  }

  async buscarPorId(id) {
    const pedido = await Pedido.findById(id)
      .populate('usuario', 'nome email')
      .populate('itens.produto', 'nome preco img');
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
  }

  async criar({ usuarioId, produto, quantidade, endereco, frete }) {
    const produtoReal = await Produto.findById(produto.id || produto._id);
    if (!produtoReal) throw new Error('Produto não encontrado');
    if (produtoReal.quantidade < quantidade) {
      throw new Error(`Estoque insuficiente. Disponível: ${produtoReal.quantidade}`);
    }

    const itens = [{ produto: produtoReal._id, quantidade, precoUnitario: produtoReal.preco }];
    const subtotal = produtoReal.preco * quantidade;
    const total = subtotal + (frete || 0);

    const pedido = await Pedido.create({
      usuario: usuarioId,
      itens,
      endereco,
      frete: frete || 0,
      total,
    });

    produtoReal.quantidade -= quantidade;
    await produtoReal.save();

    return pedido.populate('itens.produto', 'nome preco img');
  }

  async atualizarStatus(id, status) {
    const statusValidos = ['pendente', 'enviado', 'entregue', 'cancelado'];
    if (!statusValidos.includes(status)) throw new Error('Status inválido');

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('itens.produto', 'nome preco img');
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
  }

  async deletar(id) {
    const pedido = await Pedido.findByIdAndDelete(id);
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
  }
}

module.exports = PedidoService;
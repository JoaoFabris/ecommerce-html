const Carrinho = require('../models/Carrinho');
const Produto = require('../models/Produto');

class CarrinhoService {
  async buscarOuCriar(usuarioId) {
    let carrinho = await Carrinho.findOne({ usuario: usuarioId })
      .populate('itens.produto', 'nome preco img');
    if (!carrinho) {
      carrinho = await Carrinho.create({ usuario: usuarioId, itens: [] });
    }
    return carrinho;
  }

  async adicionarItem(usuarioId, { produtoId, quantidade }) {
    const produto = await Produto.findById(produtoId);
    if (!produto) throw new Error('Produto não encontrado');
    if (produto.quantidade < quantidade) throw new Error(`Estoque insuficiente. Disponível: ${produto.quantidade}`);

    const carrinho = await Carrinho.findOne({ usuario: usuarioId });

    if (carrinho) {
      const index = carrinho.itens.findIndex(i => i.produto.toString() === produtoId);
      if (index >= 0) {
        carrinho.itens[index].quantidade += quantidade;
      } else {
        carrinho.itens.push({ produto: produtoId, quantidade });
      }
      await carrinho.save();
      return carrinho.populate('itens.produto', 'nome preco img');
    }

    const novoCarrinho = await Carrinho.create({
      usuario: usuarioId,
      itens: [{ produto: produtoId, quantidade }]
    });
    return novoCarrinho.populate('itens.produto', 'nome preco img');
  }

  async removerItem(usuarioId, produtoId) {
    const carrinho = await Carrinho.findOne({ usuario: usuarioId });
    if (!carrinho) throw new Error('Carrinho não encontrado');

    carrinho.itens = carrinho.itens.filter(i => i.produto.toString() !== produtoId);
    await carrinho.save();
    return carrinho.populate('itens.produto', 'nome preco img');
  }

  async limpar(usuarioId) {
    const carrinho = await Carrinho.findOne({ usuario: usuarioId });
    if (!carrinho) throw new Error('Carrinho não encontrado');
    carrinho.itens = [];
    await carrinho.save();
    return carrinho;
  }
}

module.exports = CarrinhoService;
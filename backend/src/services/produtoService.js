const Produto = require('../models/Produto');

class ProdutoService {
  async listarTodos({ page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;
    const total = await Produto.countDocuments();
    const produtos = await Produto.find()
      .populate('categoria', 'nome')
      .skip(skip)
      .limit(limit);

    return { produtos, total, page, totalPages: Math.ceil(total / limit) };
  }

  async buscarPorId(id) {
    const produto = await Produto.findById(id).populate('categoria', 'nome');
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  }

  async criar({ nome, preco, categoria, quantidade, img }) {
    return Produto.create({ nome, preco, categoria, quantidade, img });
  }

  async atualizar(id, { nome, preco, categoria, quantidade, img }) {
    const produto = await Produto.findByIdAndUpdate(
      id,
      { nome, preco, categoria, quantidade, img },
      { new: true, runValidators: true }
    ).populate('categoria', 'nome'); // O populate serve para fazer um "join" (união) entre coleções no MongoDB usando o Mongoose. 
    // O Mongoose vai até a coleção de categorias, busca quem tem aquele ID e traz os dados de lá.
    // similar to a SQL JOIN operation
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  }

  async deletar(id) {
    const produto = await Produto.findByIdAndDelete(id);
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  }
}

module.exports = ProdutoService;
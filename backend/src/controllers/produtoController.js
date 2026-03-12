//recebe a req e retorna o status code

const ProdutoService = require('../services/produtoService');

function listar(req, res) {
  try {
    const service = new ProdutoService();
    const produtos = service.listarTodos();
    res.json(produtos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function buscarPorId(req, res) {
  try {
    const service = new ProdutoService();
    const produto = service.buscarPorId(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.json(produto);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

function criar(req, res) {
  try {
    const { nome, preco, categoria, quantidade, img } = req.body;

    const service = new ProdutoService();
    const produto = service.criar(nome, Number(preco), categoria, Number(quantidade), img);

    res.status(201).json(produto);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function atualizar(req, res) {
  try {
    const { nome, preco, categoria, quantidade, img } = req.body;

    const service = new ProdutoService();
    service.atualizarProduto(
      req.params.id,
      nome,
      preco ? Number(preco) : preco,
      categoria,
      quantidade ? Number(quantidade) : quantidade,
      img
    );

    const produtoAtualizado = service.buscarPorId(req.params.id);
    res.json(produtoAtualizado);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

function deletar(req, res) {
  try {
    const service = new ProdutoService();
    const produto = service.buscarPorId(req.params.id);

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    service.deletar(req.params.id);
    res.json({ mensagem: 'Produto removido com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  deletar,
};
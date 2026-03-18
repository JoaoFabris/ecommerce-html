const CarrinhoService = require('../services/carrinhoService');
const service = new CarrinhoService();

async function buscar(req, res) {
  try {
    const carrinho = await service.buscarOuCriar(req.user.id);
    res.json(carrinho);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function adicionar(req, res) {
  try {
    const carrinho = await service.adicionarItem(req.user.id, req.body);
    res.json(carrinho);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function remover(req, res) {
  try {
    const carrinho = await service.removerItem(req.user.id, req.params.produtoId);
    res.json(carrinho);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function limpar(req, res) {
  try {
    await service.limpar(req.user.id);
    res.json({ mensagem: 'Carrinho limpo com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { buscar, adicionar, remover, limpar };
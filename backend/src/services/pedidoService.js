const Pedido = require('../models/Pedido');
const Produto = require('../models/Produto');
const fs = require('fs');
const path = require('path');
const ProdutoService = require('./produtoService');

const ARQUIVO = path.join(__dirname, '../data/pedidos.json');

class PedidoService {
  constructor() {
    this.pedidos = fs.existsSync(ARQUIVO)
      ? JSON.parse(fs.readFileSync(ARQUIVO, 'utf-8'))
      : [];
  }

  salvarJSON() {
    fs.writeFileSync(ARQUIVO, JSON.stringify(this.pedidos, null, 2), 'utf-8');
  }

  listaTodosOsPedidos() {
    return this.pedidos;
  }

  limparTodosOsPedidos() {
    this.pedidos = [];
    this.salvarJSON();
  }

  criar(dadosProduto, quantidade, endereco, frete) {
    const produtoService = new ProdutoService();
    const produtoReal = produtoService.buscarPorId(dadosProduto.id);

    if (produtoReal.quantidade < quantidade) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${produtoReal.quantidade}`,
      );
    }

    const itens = [{ produto: produtoReal, quantidade }];
    const pedido = new Pedido(itens, endereco, frete); // ← passa para o model

    produtoReal.quantidade -= quantidade;
    produtoService.salvarJSON();

    this.pedidos.push(pedido);
    this.salvarJSON();
    return pedido;
  }

  buscarPorId(id) {
    return this.pedidos.find((p) => p.id === id);
  }

  deletar(id) {
    const index = this.pedidos.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new Error('Pedido não encontrado');
    }

    const removido = this.pedidos.splice(index, 1)[0];
    this.salvarJSON();

    return removido;
  }

  atualizar(id, dados) {
    const pedido = this.buscarPorId(id);

    if (!pedido) {
      throw new Error('Pedido não encontrado');
    }

    if (dados.status) {
      pedido.status = dados.status;
    }

    this.salvarJSON();

    return pedido;
  }
}

module.exports = PedidoService;

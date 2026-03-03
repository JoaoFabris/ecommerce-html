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

  listaTodosOsPedidos(){
    return this.pedidos
  }

  limparTodosOsPedidos() {
  this.pedidos = [];
  this.salvarJSON(); 
}

  criar(dadosProduto, quantidade) {
    const produtoService = new ProdutoService();
    const produtoReal = produtoService.buscarPorId(dadosProduto.id);

    if (produtoReal.quantidade < quantidade) {
      throw new Error(
        `Estoque insuficiente. Disponível: ${produtoReal.quantidade}`,
      );
    }

    // usa produtoReal diretamente — já é instância de Produto
    const itens = [{ produto: produtoReal, quantidade }];
    const pedido = new Pedido(itens);

    // desconta o estoque e salva
    produtoReal.quantidade -= quantidade;
    produtoService.salvarJSON();

    this.pedidos.push(pedido);
    this.salvarJSON();
    return pedido;
  }
}

module.exports = PedidoService;

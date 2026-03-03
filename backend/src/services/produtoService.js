const Produto = require('../models/Produto');

const fs = require('fs');
const path = require('path');

const ARQUIVO = path.join(__dirname, '../data/produtos.json');

class ProdutoService {
  constructor() {
    //está usando persistência em arquivo (produtos.json),
    if (fs.existsSync(ARQUIVO)) {
      const data = fs.readFileSync(ARQUIVO, 'utf-8');
      this.produtos = JSON.parse(data);
    } else {
      this.produtos = [];
    }
  }

  limparBanco() {
    this.produtos = [];
    this.salvarJSON();
  }
  salvarJSON() {
    fs.writeFileSync(ARQUIVO, JSON.stringify(this.produtos, null, 2), 'utf8');
  }

  listarTodos() {
    return this.produtos;
  }

  buscarPorId(id) {
    return this.produtos.find((p) => p.id === id);
  }

  calcularMediaPreco() {
    if (this.produtos.length === 0) return 0;
    const sum = this.produtos.reduce((acc, curr) => curr.preco + acc, 0);
    return (sum / this.produtos.length).toFixed(2);
  }

  criar(nome, preco, categoria, quantidade, img) {
  const produto = new Produto(nome, preco, categoria, quantidade, img);
  this.produtos.push(produto);
  this.salvarJSON();
  return produto;
}
}

module.exports = ProdutoService;

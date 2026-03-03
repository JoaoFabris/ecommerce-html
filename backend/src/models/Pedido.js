const { randomUUID } = require('crypto');
const Produto = require("./Produto")


const STATUS_VALIDOS = ['pendente', 'enviado', 'entregue'];

class Pedido {
  constructor(produtos) {
    this.validarProdutos(produtos);
    this.id = randomUUID();
    this.produtos = produtos;
    this.status = 'pendente';
    this.total = this.calculadoraTotal();
    this.dataCriacao = new Date();
  }

validarProdutos(produtos) {
  if (!Array.isArray(produtos) || produtos.length === 0) {
    throw new Error('O pedido deve conter ao menos um produto');
  }

  produtos.forEach((item, index) => {
    if (!item.produto || typeof item.produto.preco !== 'number' || typeof item.produto.nome !== 'string') {
      throw new Error(`Item ${index + 1}: produto inválido`);
    }

    if (typeof item.quantidade !== 'number' || item.quantidade <= 0) {
      throw new Error(`Item ${index + 1}: quantidade inválida`);
    }
  });
}

  calculadoraTotal() {
    return this.produtos.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade,
      0,
    );
  }

  atualizarStatus(novoStatus) {
    if (!STATUS_VALIDOS.includes(novoStatus)) {
      throw new Error(`Status inválido`);
    }

    this.status = novoStatus;
    return this.status;
  }
}

module.exports = Pedido;

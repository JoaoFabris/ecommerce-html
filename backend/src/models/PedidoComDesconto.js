
const Pedido = require('./Pedido')

class PedidoComDesconto extends Pedido {
  constructor(produtos, percentualDesconto) {
    super(produtos);
    this.percentualDesconto = percentualDesconto;
    this.total = this.calculadoraTotal();
  }

  calculadoraTotal() {
    const totalBruto = this.produtos.reduce(
      (acc, item) => acc + item.produto.preco * item.quantidade, 0
    );
    return parseFloat((totalBruto * (1 - this.percentualDesconto / 100)).toFixed(2));
  }
}

module.exports = PedidoComDesconto;
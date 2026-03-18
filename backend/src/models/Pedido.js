const mongoose = require('mongoose');

const itemPedidoSchema = new mongoose.Schema({
  produto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produto',
    required: true,
  },
  quantidade: {
    type: Number,
    required: true,
    min: [1, 'Quantidade mínima é 1'],
  },
  precoUnitario: {
    type: Number,
    required: true,
  },
});

const pedidoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  itens: [itemPedidoSchema],
  endereco: {
    logradouro: String,
    bairro: String,
    localidade: String,
    uf: String,
    cep: String,
  },
  frete: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendente', 'enviado', 'entregue', 'cancelado'],
    default: 'pendente',
  },
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
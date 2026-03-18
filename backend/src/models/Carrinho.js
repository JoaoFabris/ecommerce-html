const mongoose = require('mongoose');

const itemCarrinhoSchema = new mongoose.Schema({
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
});

const carrinhoSchema = new mongoose.Schema({
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  itens: [itemCarrinhoSchema],
}, { timestamps: true });

module.exports = mongoose.model('Carrinho', carrinhoSchema);
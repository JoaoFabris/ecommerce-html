//regra do negocio
const mongoose = require('mongoose');

const produtoSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true,
  },
  preco: {
    type: Number,
    required: [true, 'Preço é obrigatório'],
    min: [0, 'Preço não pode ser negativo'],
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'Categoria é obrigatória'],
  },
  quantidade: {
    type: Number,
    required: [true, 'Quantidade é obrigatória'],
    min: [0, 'Quantidade não pode ser negativa'],
  },
  img: {
    type: String,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model('Produto', produtoSchema);
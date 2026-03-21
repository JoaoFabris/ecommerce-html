const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const enderecoSchema = new mongoose.Schema(
  {
    logradouro: { type: String, trim: true },
    bairro: { type: String, trim: true },
    localidade: { type: String, trim: true },
    uf: { type: String, trim: true, maxlength: 2 },
    cep: { type: String, trim: true },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    senha: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    favoritos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Produto',
      },
    ],
    endereco: enderecoSchema,
  },
  { timestamps: true },
); //Basicamente, ela instrui o Mongoose a gerenciar automaticamente dois campos de data para cada documento que você criar na coleção:(createdAt) (updatedAt)

userSchema.pre('save', async function () {
  //logo, antes de salvar 'pre', quero q de formar async, pegar a senha e fazer um bcrypt dessa senha. 10 é as vzs q embarelhei e misturei a senha antes de guardar a senha no bd
  if (!this.isModified('senha')) return;
  this.senha = await bcrypt.hash(this.senha, 10);
});

userSchema.methods.compararSenha = async function (senhaDigitada) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model('User', userSchema);

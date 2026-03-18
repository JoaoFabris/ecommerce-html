const User = require('../models/User');
const gerarToken = require('../utils/gerarToken');

class UserService {
  async registrar({ nome, email, senha }) {
    const existe = await User.findOne({ email });
    if (existe) throw new Error('Email já cadastrado');

    const user = await User.create({ nome, email, senha });
    const token = gerarToken(user);

    return { id: user._id, nome: user.nome, email: user.email, role: user.role, token };
  }

  async login({ email, senha }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email ou senha inválidos');

    const senhaCorreta = await user.compararSenha(senha);
    if (!senhaCorreta) throw new Error('Email ou senha inválidos');

    const token = gerarToken(user);
    return { id: user._id, nome: user.nome, email: user.email, role: user.role, token };
  }

  async listarTodos() {
    return User.find().select('-senha');
  }

  async buscarPorId(id) {
    const user = await User.findById(id).select('-senha');
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }

  async deletar(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new Error('Usuário não encontrado');
    return user;
  }
}

module.exports = UserService;

// O Service deve apenas:

// Lidar com a Regra de Negócio.

// Decidir se um usuário pode ou não fazer uma compra.

// Calcular descontos, taxas ou juros.

// Comunicar-se com o Banco de Dados (através do Model).
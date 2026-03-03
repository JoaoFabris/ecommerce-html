const { randomUUID } = require('crypto')

class Pessoa {
    constructor(nome, cpf, email, senha, endereco){
        this.#validarDados(nome, cpf, senha, endereco)
        this.id = randomUUID()
        this.nome = nome
        this.cpf = cpf
        this.email = email
        this.senha = senha
        this.endereco = endereco
        this.historicoPedidos = []
    }

    #validarDados(nome, cpf, email, senha, endereco) {
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      throw new Error('Erro na validação do nome');
    }

    if (!cpf || typeof cpf !== 'string' || cpf.replace(/\D/g, '').length !== 11) {
      throw new Error('Erro na validação do CPF');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Erro na validação do email');
    }

    if (!senha || typeof senha !== 'string' || senha.length < 6) {
      throw new Error('A senha deve ter no mínimo 6 caracteres');
    }

    if (!endereco || typeof endereco !== 'object') {
      throw new Error('Erro na validação do endereço');
    }
  }

  adicionarPedidos(pedido){
    this.historicoPedidos.push(pedido)
  }

  listarPedidos() {
    return this.historicoPedidos
  }
}

module.exports = Pessoa
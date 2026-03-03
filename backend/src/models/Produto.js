const { randomUUID } = require('crypto');

class Produto {
  constructor(nome, preco, categoria, quantidade, img = null) {
    this.#validarDados(nome, preco, categoria,  quantidade, img);
    this.id = randomUUID();
    this.nome = nome;
    this.preco = preco;
    this.categoria = categoria;
    this.quantidade = quantidade;
    this.img = img
  }

  #validarDados(nome, preco, categoria, quantidade, img) {
    if (!nome || typeof nome !== 'string' || nome.trim().length <= 0) {
      throw new Error('Erro na validação do nome');
    }

    if (typeof preco !== 'number' || preco <= 0) {
      throw new Error('Erro na validação do preço');
    }

    if (!categoria || typeof categoria !== 'string' || categoria.trim().length <= 0) {
      throw new Error('Erro na validação da categoria');
    }

    if (typeof quantidade !== 'number' || quantidade < 0) {
      throw new Error('Erro na validação da quantidade');
    }
      if (img !== undefined && img !== null && typeof img !== 'string') {
      throw new Error('Erro na validação da imagem');
    }
  }

  calcularDesconto(percentual) {
  if (percentual <= 0 || percentual > 100) throw new Error('Percentual inválido');
  return parseFloat((this.preco * (1 - percentual / 100)).toFixed(2));
}

}

module.exports = Produto;
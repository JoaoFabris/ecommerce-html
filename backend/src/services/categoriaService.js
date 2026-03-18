const Categoria = require("../models/Categoria")

class CategoriaService {
  async listarTodos() {
    return Categoria.find();
  }

  async buscarPorId(id) {
    const categoria = await Categoria.findById(id);
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  }

  async criar({ nome, descricao }) {
    const existe = await Categoria.findOne({ nome });
    if (existe) throw new Error('Categoria já cadastrada');
    return Categoria.create({ nome, descricao });
  }

  // Ao desestruturar, você está criando variáveis locais apenas para nome e descricao. O resto do objeto enviado pelo body da requisição é ignorado pelo Service.
  async atualizar(id, { nome, descricao }) {
    const categoria = await Categoria.findByIdAndUpdate(
      id,
      { nome, descricao },
      { new: true, runValidators: true }, // NEW: Faz o Mongoose retornar a categoria já atualizada. Sem isso, ele retornaria o objeto como ele era antes da mudança.
      // runValidators: Garante que as regras definidas no seu Model (como tamanho mínimo de texto) sejam verificadas durante a atualização.
    );
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  }

  async deletar(id) {
    const categoria = await Categoria.findByIdAndDelete(id);
    if (!categoria) throw new Error('Categoria não encontrada');
    return categoria;
  }
}

module.exports = CategoriaService;

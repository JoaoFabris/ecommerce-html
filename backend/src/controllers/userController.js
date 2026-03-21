const UserService = require('../services/userService');
const service = new UserService();

async function registrar(req, res) {
  try {
    const data = await service.registrar(req.body);
    res.status(201).json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function login(req, res) {
  try {
    const data = await service.login(req.body);
    res.json(data);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}

async function listar(req, res) {
  try {
    const users = await service.listarTodos();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function deletar(req, res) {
  try {
    await service.deletar(req.params.id);
    res.json({ mensagem: 'Usuário removido com sucesso' });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function atualizar(req, res) {
  try {
    const user = await service.atualizar(req.params.id, req.body);
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function adicionarFavorito(req, res) {
  try {
    const user = await service.adicionarFavorito(
      req.user.id,
      req.params.produtoId,
    );
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function removerFavorito(req, res) {
  try {
    const user = await service.removerFavorito(
      req.user.id,
      req.params.produtoId,
    );
    res.json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function listarFavoritos(req, res) {
  try {
    const favoritos = await service.listarFavoritos(req.user.id);
    res.json(favoritos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

module.exports = {
  registrar,
  login,
  listar,
  atualizar,
  deletar,
  adicionarFavorito,
  removerFavorito,
  listarFavoritos,
};

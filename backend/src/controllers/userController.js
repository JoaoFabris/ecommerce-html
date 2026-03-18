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
    const deletetedUser = await service.deletar(req.params.id);
    await service.deletar(deletetedUser);
    if (deletetedUser === null) {
      res.status(404).send({ mensagem: 'Usuário não encontrado' });
    } else {
      res.status(200)({ mensagem: 'Usuário deletado' });
    }
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

module.exports = { registrar, login, listar, deletar };

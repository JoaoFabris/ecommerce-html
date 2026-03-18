//esse codigo é ativaod no meio de alguma logica ou função antes de prosseguir com os proximos passos da logica 
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const authHeader = req.headers.authorization; // aqui q fica no token em authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer')) { 
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1]; // quando usamos o split, uma parte fica o Bearer e o outro o Token, logo o [1], pega apenas o Token ["Bearer, <token>"]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

module.exports = auth;
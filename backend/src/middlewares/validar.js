const { validationResult } = require('express-validator');

function validar(req, res, next) {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.status(400).json({ erros: erros.array() });
  }
  next();
}

module.exports = validar;

// responsável por capturar os erros gerados pelo express-validator e impedir que a requisição continue se estiver inválida.



// parei na aula 35 e devo fazer o swagger
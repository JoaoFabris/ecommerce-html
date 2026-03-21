function paginacao(req, res, next) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  req.paginacao = { page, limit, skip };
  next();
}

module.exports = paginacao;
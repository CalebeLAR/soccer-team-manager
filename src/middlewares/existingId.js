const existingId = (req, res, next) => {
  const id = Number(req.params.id);
  if (teams.some((t) => t.id === id)) {
    return next();
  }
  res.status(404).json({ message: 'Time não encontrado' });;
};  

module.exports = existingId;
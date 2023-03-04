// src/middlewares/apiCredentials.js
const fs = require('fs/promises');

const teams = [
  { id: 1, nome: 'São Paulo Futebol Clube', sigla: 'SPF' },
  { id: 2, nome: 'Sociedade Esportiva Palmeiras', sigla: 'PAL' },
];

// como vamos ler arquivos assincronamente, precisamos do async
async function apiCredentials(req, res, next) {
  // pega o token do cabeçalho, se houver
  const token = req.header('X-API-TOKEN');
  // lê o conteúdo do  (relativo à raiz do projeto)
  const authdata = await fs.readFile('./authdata.json', { encoding: 'utf-8' });
  // readFile nos deu uma string, agora vamos carregar um objeto a partir dela
  const authorized = JSON.parse(authdata);

  if (token in authorized) {
    next(); // pode continuar
  } else {
    res.sendStatus(401); // não autorizado
  }
};

const validateTeam = (req, res, next) => {
  const { nome, sigla } = req.body;
  if (!nome) return res.status(400).json({ message: 'O campo "nome" é obrigatório'});
  if (!sigla) return res.status(400).json({ message: 'O campo "sigla" é obrigatório'});
  next();
};

const existingId = (req, res, next) => {
  const id = Number(req.params.id);
  if (teams.some((t) => t.id === id)) {
    return next();
  }
  res.status(400).json({ message: 'Id não encontrado'});;
};

module.exports = {
  apiCredentials,
  validateTeam,
  existingId,
  teams,
};
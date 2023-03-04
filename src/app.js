const express = require('express');
require('express-async-errors'); // não precisa definir uma variável
const { 
  apiCredentials, 
  validateTeam, 
  existingId, 
  teams
} = require('./middlewares/apiCredentials');

let nextId = 3;

const app = express();
app.use(express.json());

app.get('/teams', (req, res) => res.json(teams));

app.use(apiCredentials);

app.get("/teams/:id", existingId, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find(t => t.id === id);
  res.json(team);
});

app.post('/teams', validateTeam, (req, res) => {
  if (
    // confere se a sigla proposta está inclusa nos times autorizados
    !req.teams.teams.includes(req.body.sigla)
    // confere se já não existe um time com essa sigla
    && teams.every((t) => t.sigla !== req.body.sigla)
  ) {
    return res.status(422).json({ message: 'Já existe um time com essa sigla' });
  }
  const team = { id: nextId, ...req.body };
  teams.push(team);
  nextId += 1;
  res.status(201).json(team);
});

app.put('/teams/:id', existingId ,validateTeam, (req, res) => {
  const id = Number(req.params.id);
  const index = teams.findIndex((t)=> t.id === id);
  const updatedTeam = { id, ...req.body }
  teams.splice(index, 1, updatedTeam)
  res.status(201).json(teams);
});

app.delete('/teams/:id', existingId, (req, res) => {
  const id = Number(req.params.id);
  const team = teams.find(t => t.id === id);
  const index = teams.indexOf(team);
  teams.splice(index, 1);
  res.sendStatus(204);
});

module.exports = app;
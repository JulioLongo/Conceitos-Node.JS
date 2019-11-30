const express = require("express");

const server = express();
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name" : "Diego", "email": "diego" }

// CRUD - Cread, read, update, delete

const users = ["Julio", "Nath", "Jaime"];

// Middleware
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});

function checkNameJson(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkIndexExists(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  return next();
}

// Retorna Array users
server.get("/users/", (req, res) => {
  return res.json(users);
});

// Retorna user pelo Index
server.get("/users/:index", checkIndexExists, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

// Insere novo user no Array
server.post("/users/", checkNameJson, (req, res) => {
  const { name } = req.body;

  users.push(name);

  res.json(users);
});

// Atualizar o nome pelo index do array.
server.put("/users/:index", checkIndexExists, checkNameJson, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  res.json(users);
});

// Deletar o nome pelo index do array
server.delete("/users/:index", checkIndexExists, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  res.json(users);
  //res.send();
});

// Ouvir no localhost na porta
server.listen(3000);

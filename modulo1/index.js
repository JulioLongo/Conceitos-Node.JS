const express = require("express");

const server = express();
server.use(express.json());

// Query params = ?teste=1
// Route params = /users/1
// Request body = { "name" : "Diego", "email": "diego" }

// CRUD - Cread, read, update, delete

const users = ["Julio", "Nath", "Jaime"];

//Middleware
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();
  console.timeEnd("Request");
});

function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];
  if (!user) {
    return res.status(400).json({ error: "User does not exist" });
  }

  return next();
}

server.get("/users/", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

server.post("/users/", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;
  res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  res.json(users);
  //res.send();
});

//ouvir no localhost na porta
server.listen(3000);

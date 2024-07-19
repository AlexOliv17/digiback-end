//configurando o dotenv para carregar as variáveis de ambiente
require("dotenv").config();

//Importando os módulos necessários para a aplicação
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//Instanciando o express
const digiback = express();

//Definindo a porta
const PORT = process.env.PORT || 3000;
digiback.use(express.json());

//Configurando o Database
const db = new sqlite3.Database(":memory:");
const seedDatabase = require("./seed");

digiback.use(express.json());
// Middleware para autenticação
const authenticateToken = (req, res, next) => {
   const token = req.headers["authorization"];
   if (!token) return res.sendStatus(401);

   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
   });
};

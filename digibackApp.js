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

//Criando a tabela de Digimons
db.serialize(() => {
   db.run(
      "CREATE TABLE digimons (id INTEGER PRIMARY KEY, name TEXT, img TEXT, level TEXT)"
   );
});

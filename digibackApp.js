//configurando o dotenv para carregar as variáveis de ambiente
require("dotenv").config();

//Importando os módulos necessários para a aplicação
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();

//Instanciando o express
const digiback = express();

//Definindo a porta
const PORT = process.env.PORT || 3000;

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

// Registra um novo usuário
digiback.post("/register", async (req, res) => {
   try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      db.run(
         "INSERT INTO users (username, password) VALUES (?, ?)",
         [username, hashedPassword],
         (err) => {
            if (err) {
               return res.status(400).json({ message: "Usuário já existe." });
            }
            res.status(201).json({
               message: "Usuário registrado com sucesso.",
            });
         }
      );
   } catch {
      res.status(500).json({ message: "Erro ao registrar usuário." });
   }
});

// Login de usuário
digiback.post("/login", (req, res) => {
   const { username, password } = req.body;

   db.get(
      "SELECT * FROM users WHERE username = ?",
      [username],
      async (err, user) => {
         if (err || !user) {
            return res
               .status(400)
               .json({ message: "Usuário ou senha inválidos." });
         }

         if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign(
               { username: user.username },
               process.env.ACCESS_TOKEN_SECRET,
               { expiresIn: "1h" }
            );
            res.json({ accessToken });
         } else {
            res.status(400).json({ message: "Usuário ou senha inválidos." });
         }
      }
   );
});

// Armazenando API no banco de dados
app.get("/load-digimons", authenticateToken, async (req, res) => {
   try {
      const response = await axios.get(
         "https://digimon-api.vercel.app/api/digimon"
      );
      const digimons = response.data;

      digimons.forEach((digimon) => insertDigimon(digimon));

      res.send("Armazenamento realizado com sucesso!");
   } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao carregar Digimons.");
   }
});

// Filtrar Digimons por level
app.get("/digimons/level/:level", authenticateToken, (req, res) => {
   const level = req.params.level;
   db.all("SELECT * FROM digimons WHERE level = ?", [level], (err, rows) => {
      if (err) {
         res.status(500).send("Erro ao buscar Digimons.");
         return;
      }
      res.json(rows);
   });
});

// Filtrar digimons por nome
app.get("/digimons/name/:name", authenticateToken, (req, res) => {
   const name = req.params.name;
   db.all("SELECT * FROM digimons WHERE name = ?", [name], (err, rows) => {
      if (err) {
         res.status(500).send("Erro ao buscar Digimons.");
         return;
      }
      res.json(rows);
   });
});

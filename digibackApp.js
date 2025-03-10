// Configurando o dotenv para carregar as variáveis de ambiente
require("dotenv").config();

// Importando os módulos necessários para a aplicação
const express = require("express");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Instanciando o express
const digiback = express();

// Definindo a porta
const PORT = process.env.PORT || 3000;
digiback.use(express.json());

// Configurando o Database
const db = new sqlite3.Database("data.db"); // Usando um arquivo de banco de dados persistente
const seedDatabase = require("./seed");

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
digiback.get("/load-digimons", authenticateToken, async (req, res) => {
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

// Filtrar Digimons por nível
digiback.get("/digimons/level/:level", authenticateToken, (req, res) => {
   const level = req.params.level;
   db.all("SELECT * FROM digimons WHERE level = ?", [level], (err, rows) => {
      if (err) {
         res.status(500).send("Erro ao buscar Digimons.");
         return;
      }
      res.json(rows);
   });
});

// Filtrar Digimons por nome
digiback.get("/digimons/name/:name", authenticateToken, (req, res) => {
   const name = req.params.name;
   db.all("SELECT * FROM digimons WHERE name = ?", [name], (err, rows) => {
      if (err) {
         res.status(500).send("Erro ao buscar Digimons.");
         return;
      }
      res.json(rows);
   });
});

// Executando e iniciando o servidor
seedDatabase().then(() => {
   digiback.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
   });
});

const insertDigimon = (digimon) => {
   const stmt = db.prepare(
      "INSERT INTO digimons (name, img, level) VALUES (?, ?, ?)"
   );
   stmt.run(digimon.name, digimon.img, digimon.level);
   stmt.finalize();
};

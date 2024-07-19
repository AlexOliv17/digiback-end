const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("data.db"); // Usando um arquivo de banco de dados persistente

// Função para criar tabelas e inserir dados iniciais
const seedDatabase = async () => {
   return new Promise((resolve, reject) => {
      db.serialize(async () => {
         // Criar tabela de Digimons
         db.run(
            "CREATE TABLE IF NOT EXISTS digimons (id INTEGER PRIMARY KEY, name TEXT, img TEXT, level TEXT)"
         );

         // Criar tabela de Usuários
         db.run(
            "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)"
         );

         // Inserir usuário admin com senha criptografada
         const hashedPassword = await bcrypt.hash("adminpassword", 10);
         db.run(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            ["admin", hashedPassword],
            (err) => {
               if (err) {
                  // Se o usuário já existir, não faz nada
                  if (err.message.includes("UNIQUE constraint failed")) {
                     console.log("Usuário admin já existe.");
                  } else {
                     return reject(err);
                  }
               }
               resolve();
            }
         );
      });
   });
};

module.exports = seedDatabase;

const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

// Configurar o banco de dados SQLite
const db = new sqlite3.Database(":memory:");

// Função para criar tabelas e inserir dados iniciais
const seedDb = async () => {
   db.serialize(async () => {
      // Criar tabela de Digimons
      db.run(
         "CREATE TABLE digimons (id INTEGER PRIMARY KEY, name TEXT, img TEXT, level TEXT)"
      );

      // Criar tabela de Usuários
      db.run(
         "CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)"
      );

      // Inserir usuário admin com senha criptografada
      const hashedPassword = await bcrypt.hash("adminpassword", 10);
      db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
         "admin",
         hashedPassword,
      ]);

      console.log("Tabelas criadas e dados iniciais inseridos.");
   });
};

// Executar a função de seed
seedDb();

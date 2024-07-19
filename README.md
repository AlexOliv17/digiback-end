# Projeto Digiback
### Este é um projeto Node.js com Express que consome dados de uma API de Digimons e os armazena em um banco de dados SQLite. A aplicação utiliza autenticação JWT para proteger as rotas.

## Requisitos
Node.js (versão 14 ou superior)<br/>
npm (gerenciador de pacotes do Node.js)<br/>
SQLite (embutido no projeto, não requer instalação separada)

## Instalação
 👉Clone o repositório;

 👉Instale as dependências: 
 ### As principais dependências são: <br/>
➖ express: Framework para criação de servidores web.<br/>
➖ axios: Cliente HTTP para fazer requisições à API de Digimons.<br/>
➖ sqlite3: Biblioteca para interação com o banco de dados SQLite.<br/>
➖ jsonwebtoken: Biblioteca para criação e verificação de tokens JWT.<br/>
➖ bcrypt: Biblioteca para criptografia de senhas.
### Comandos:
   - "npm install"
   - "npm install express axios sqlite3 jsonwebtoken bcrypt"



## Configure as variáveis de ambiente
 👉Crie um arquivo .env na raiz do projeto e adicione a seguinte trecho:

 ACCESS_TOKEN_SECRET= digi_back_end <br/>
 PORT=3000
 
## Configuração do Banco de Dados
 👉Execute o script de seed: "node seed.js"

## Execução
 👉Inicie o servidor: "node app.js" <br/>

   ➖ O servidor estará disponível em http://localhost:3000.

## Autenticação
 👉Instale o Postman: https://www.postman.com/downloads/ <br/>
 👉Use o endpoint /login para obter o token.

### Login
  ➖ Método: POST<br/>
  ➖ URL: http://localhost:3000/login<br/>
  ➖ Adicione ao corpo da requisição no formato Json: <br/>
{
  "username": "admin",
  "password": "adminpassword"
}

## Endpoints
 👉Carregar Digimons da API externa<br/>
  ➖ Método: GET<br/>
  ➖ URL: http://localhost:3000/load-digimons<br/>
  ➖ Autorização: Bearer token JWT no cabeçalho Authorization.<br/>
❗ Este endpoint carrega os Digimons da API externa e os armazena no banco de dados.


 👉Filtrar Digimons por nível<br/>
  ➖ Método: GET<br/>
  ➖ URL: http://localhost:3000/digimons/level/:level<br/>
  ➖ Parâmetro de URL: level (o nível do Digimon, como "Rookie")<br/>
  ➖ Autorização: Bearer token JWT no cabeçalho Authorization.<br/>
❗ Retorna todos os Digimons com o nível especificado.


 👉Filtrar Digimons por nome<br/>
  ➖ Método: GET<br/>
  ➖ URL: http://localhost:3000/digimons/name/:name<br/>
  ➖ Parâmetro de URL: name (o nome do Digimon, como "Agumon")<br/>
  ➖ Autorização: Bearer token JWT no cabeçalho Authorization.<br/>
❗ Retorna todos os Digimons com o nome especificado.

## Estrutura do Projeto
### app.js: 
  - Código principal da aplicação Express, incluindo a configuração do servidor, endpoints e autenticação.
### seed.js: 
  - Script para criar e popular o banco de dados SQLite.
### .env:
  - Arquivo de variáveis de ambiente (não incluído no controle de versão).
### node_modules/:
  - Dependências do projeto (não incluído no controle de versão).

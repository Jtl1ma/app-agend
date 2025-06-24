SEQUENCIA PARA CRIAR O PROJETO
Criar o arquivo package
### npm init -y
No script "start": "node./", para rodar 
### npm run start
Instalei as dependencias typescript
### npm install --g typescript
Crio o arquivo tsconfig
### tsc --init
Para converter de js para ts
No package json
### "main": "./dist/index.js",
Instalo as dependencias global
### npm install --save-dev typescript @types/node
Gera autocomplit
Acrecento no script
### "build": "tsc -p .",
### npm run build
Faz a converesao de js para ts
Express
Gerencia as requisicoes, rotas e URLs, entre outras funcionalidades, nos permite receber e devolver via protocolo HTTP
Instalo as dependencias
### npm install --save express e --save-dev @types/express
Automatizando o servidor para identificar alteracoes no codigo
Instalo as dependecias
### npm install --save-dev ts-node-dev
Acrecento o script
### "dev": "ts-node-dev --respawn --transpile-only --ignore-watch node_nodules src/index.ts"
Para rodar aplicaçao
### npm run dev
Para acessar aplicaçao no navegador
### http://localhost:3000
Utilizei o Engine para criar as views
Instalei as dependencias
### npm install ejs
Criamos a pasta views
No index.ts primeiramente passamos qual template engine vamos utilizar, como primeiro parâmetro passamos o termo "view engine", e o segundo parâmetro "ejs". Desta forma o Express entende que queremos usar o EJS.

Crio a rota get e nela vamos passar qual view será retornada quando houver essa requisição for chamada
### res.render("index")

Configurando o Multer
Multer é um middleware node.js para manipulação multpart/form-data, usado para o upload de arquivos.
Instalo as dependencias
### npm install --save multer



imgFileController é um servico de paginação e ordenação
routeFile chama esse servilo pela /files
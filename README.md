# ✅ Fincheck

API Rest desenvolvida com o intuito de fornecer ao usuário uma forma de gerenciar suas contas bancárias e suas respectivas transações. Desenvolvida com NodeJs e NestJS,esta API implementa boas práticas de autenticação, validação e estruturação de código. Entre os principais recursos abordados estão:

- Autenticação com JWT, onde os dados do usuário autenticado (como id e email) são armazenados no token e utilizados para validar e identificar o usuário nas rotas protegidas

- Criptografia de senhas com bcryptjs

- Validação de objetos baseados em classes com class-validator

- Transformação de objetos literais em instâncias de classe com class-transformer, utilizada para validação de variáveis de ambiente

- Criação de decorators customizados para reutilização de lógica

- Criação de pipes personalizados para manipulação e validação de dados

## 🛠️ Tecnologias utilizadas

- Node
- NestJs
- PostgreSQL
- Prisma
- Docker

## 📜 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node (22.14.0)](https://nodejs.org/pt)
- [Docker](https://www.docker.com/)
- [Git](https://git-scm.com/)

## 🧭 Rodando o projeto

### Clone o repositório

```bash
git clone https://github.com/2joliveira/dslist.git
```
### Configure o banco de dados

```bash
# Criar e iniciar um container usando a imagem oficial do PostgreSQL no Docker, configurando usuário, senha e definir a porta padrão do banco para acesso externo.
  docker run --name pg -e POSTGRES_USER=root -e POSTGRES_PASSWORD=root -p 5432:5432 -d postgres

# Inicializar container
  docker start pg

# Acessar container (pg)
  docker exec -it pg bash

# Conecter-se ao PostgreSQL como usuário root
  psql -U root

# Criar banco de dados com SQL
  CREATE DATABASE fincheck;
```

### Instale as dependências

```bash
  npm i
```

### Configure a conexão com o banco de dados

- Crie um arquivo .env na raiz do projeto
- Defina a variável DATABASE_URL com a string de conexão do seu banco
  ```bash
  DATABASE_URL="postgresql://root:root@localhost:5432/fincheck?schema=public"
  ```

### Gere o Prisma Client

  ```bash
    npx prisma generate
  ```

### Execute as migrations para criar as tabelas no banco

  ```bash
    npx prisma migrate dev
  ```

### Defina o JWTSecret no .env

  ```bash
    JWT_SECRET="SECRET"
  ```

### Inicie o servidor

  ```bash
    npm run start:dev
  ```


## 📮 Endpoints

| Método  | Endpoint                       | Descrição                                         
| ------- | ------------------------------ | -------------------------------------------------
| `POST`  | `/auth/signup`                 | Criar conta                                      
| `POST`  | `/auth/signin`                 | Fazer login                                      
| `GET`   | `/users/me`                    | Buscar dados de usuário logado                   
| `POST`  | `/bank-accounts`               | Criar conta bancária
| `GET`   | `/bank-accounts`               | Listar contas bancárias do usuário autenticado                
| `PUT`   | `/bank-accounts/bankAccountId` | Editar conta bancária
| `DELETE`| `/bank-accounts/bankAccountId` | Deletar conta bancária
| `POST`  | `/transactions`                | Criar transação
| `GET`   | `/transactions`                | Listar transações de uma conta bancária específica                
| `PUT`   | `/transactions/transactionId`  | Editar transação
| `DELETE`| `/transactions/transactionId`  | Deletar transação
| `GET`   | `/categories`                  | Listar categorias de um usuário específico                

Nota: Esta API utiliza autenticação JWT para proteger as rotas. Apenas os endpoints **/signin** e **/signup** são acessíveis publicamente. Todos os demais requerem um token de acesso válido no cabeçalho da requisição.
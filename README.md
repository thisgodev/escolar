# BusEasy - Sistema de Gestão de Transporte Escolar

BusEasy é uma aplicação web full-stack projetada para otimizar a gestão de transporte escolar, oferecendo ferramentas para administradores, responsáveis, motoristas e monitores. O sistema integra planejamento de rotas, acompanhamento diário de alunos e gestão financeira completa.

---

## 🚀 Tecnologias Utilizadas

Este projeto é um monorepo contendo o frontend e o backend.

**Frontend:**

- **Framework:** React.js com Vite (TypeScript)
- **Estilização:** Tailwind CSS com shadcn/ui
- **Roteamento:** React Router DOM
- **Requisições HTTP:** Axios
- **Utilitários:** `lucide-react` (ícones), `date-fns`

**Backend:**

- **Ambiente:** Node.js com Express.js
- **Banco de Dados:** PostgreSQL
- **Query Builder:** Knex.js
- **Autenticação:** JWT (JSON Web Tokens)
- **Segurança:** Bcrypt (criptografia de senhas), CORS, Express Rate Limit

**Deploy:**

- **Plataforma:** Vercel (deploy separado para frontend e backend)
- **Banco de Dados:** Neon.tech (PostgreSQL serverless)

---

## 🏁 Começando: Rodando o Projeto Localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- npm (ou yarn/pnpm)
- Git

### 1. Clonando o Repositório

```bash
git clone https://github.com/SEU_USUARIO/transporte-escolar-app.git
cd transporte-escolar-app
```

### 2. Configurando o Backend

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

> **Importante:** Abra o arquivo `.env` recém-criado e preencha todas as variáveis, especialmente `DATABASE_URL` e `JWT_SECRET`.

```bash
# Rode as migrations para criar a estrutura do banco de dados
npx knex migrate:latest

# Inicie o servidor de desenvolvimento
npm run dev
```

> O backend estará rodando em `http://localhost:3001`.

### 3. Configurando o Frontend

```bash
# Em um novo terminal, navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Crie o arquivo de variáveis de ambiente
cp .env.example .env
```

> O arquivo `.env` do frontend já deve estar configurado corretamente para o ambiente local (`VITE_API_URL=http://localhost:3001/api`).

```bash
# Inicie a aplicação de desenvolvimento
npm run dev
```

> O frontend estará acessível em `http://localhost:5173`.

---

## 🔑 Variáveis de Ambiente

Para o sistema funcionar, você precisará criar arquivos `.env` nas pastas `backend` e `frontend` baseados nos arquivos `.env.example`.

**Backend (`backend/.env.example`):**

```
# URL de conexão com o seu banco de dados PostgreSQL (ex: da Neon)
DATABASE_URL="postgres://user:password@host:port/dbname"

# Segredo para a assinatura dos tokens JWT (use um gerador de senhas fortes)
JWT_SECRET="SEU_SEGREDO_SUPER_SECRETO"

# Porta em que o servidor backend irá rodar
PORT=3001
```

**Frontend (`frontend/.env.example`):**

````
# URL base para onde o frontend fará as requisições para a API
VITE_API_URL=http://localhost:3001/api```

---

## 📜 Scripts Disponíveis

-   `npm run dev`: Inicia o ambiente de desenvolvimento com hot-reload.
-   `npm run build`: Gera a build de produção do projeto.
-   `npx knex migrate:latest`: Aplica as migrations pendentes no banco.
-   `npx knex migrate:rollback`: Desfaz a última migration executada.
````

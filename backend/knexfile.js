require("dotenv").config();
module.exports = {
  development: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: { directory: "./src/database/migrations" },
  },
  production: {
    client: "pg",
    connection: {
      // A Vercel vai popular esta variável a partir dos seus secrets
      connectionString: process.env.DATABASE_URL,
      // Esta configuração é CRUCIAL para a conexão com o Neon a partir da Vercel
      ssl: {
        rejectUnauthorized: false,
      },
    },
    migrations: {
      directory: "./src/database/migrations",
    },
  },
};

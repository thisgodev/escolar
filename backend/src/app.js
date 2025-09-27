// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// --- Importação de todas as nossas rotas ---
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const studentRoutes = require("./routes/studentRoutes");
const schoolRoutes = require("./routes/schoolRoutes");
const routeRoutes = require("./routes/routeRoutes");
const contractRoutes = require("./routes/contractRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const clientRoutes = require("./routes/clientRoutes");
const reportRoutes = require("./routes/reportRoutes");
const inviteRoutes = require("./routes/inviteRoutes");
const onboardingRoutes = require("./routes/onboardingRoutes");

// --- Inicialização da Aplicação Express ---
const app = express();

// --- Configuração dos Middlewares Globais ---

// 1. CORS (Cross-Origin Resource Sharing)
// Permite que o frontend (rodando em outro domínio/porta) faça requisições para este backend.
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// 2. Parser para JSON
// Habilita a aplicação a entender requisições com corpo em formato JSON.
app.use(express.json());

// 3. Rate Limiter (Limitador de Taxa)
// Protege a API contra ataques de força bruta, limitando o número de requisições por IP.
const maxRequests = process.env.NODE_ENV === "production" ? 100 : 5000;
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Janela de 15 minutos
  max: maxRequests, // Número máximo de requisições na janela de tempo
  message:
    "Muitas requisições enviadas deste IP, por favor tente novamente mais tarde.",
  standardHeaders: true, // Retorna informações do limite nos cabeçalhos `RateLimit-*`
  legacyHeaders: false, // Desabilita os cabeçalhos legados `X-RateLimit-*`
});
app.use(limiter);

// --- Registro das Rotas ---
// Associa os arquivos de rotas aos seus respectivos prefixos de URL.
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/onboarding", onboardingRoutes);

// --- Rota de Teste (Opcional) ---
// Útil para verificar se o servidor está no ar.
app.get("/", (req, res) => {
  res.send("API BusEasy está funcionando!");
});

// --- Exportação da Instância do App ---
// Permite que o server.js importe e use esta configuração.
module.exports = app;

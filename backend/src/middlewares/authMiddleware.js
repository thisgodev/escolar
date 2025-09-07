const jwt = require("jsonwebtoken");

/**
 * Middleware para verificar a autenticação via token JWT.
 * Deve ser usado em todas as rotas que requerem que o usuário esteja logado.
 */
const authMiddleware = (req, res, next) => {
  // 1. Procura pelo cabeçalho de autorização
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Nenhum token fornecido." });
  }

  // 2. O token JWT vem no formato "Bearer [token]"
  const parts = authHeader.split(" ");
  if (parts.length !== 2) {
    return res.status(401).json({ message: "Erro no formato do token." });
  }

  const [scheme, token] = parts;
  if (!/^Bearer$/i.test(scheme)) {
    return res
      .status(401)
      .json({ message: 'Token mal formatado. O prefixo "Bearer" é esperado.' });
  }

  // 3. Verifica se o token é válido
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    // 4. Se o token for válido, anexa os dados do payload à requisição
    req.user = decoded; // ex: { id: 1, role: 'admin', name: 'Admin User' }

    return next(); // Prossegue para o próximo middleware ou para o controlador da rota
  });
};

module.exports = authMiddleware;

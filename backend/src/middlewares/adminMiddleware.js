/**
 * Middleware para verificar se o usuário autenticado tem permissão de administrador.
 * Deve ser usado em rotas que são exclusivas para administradores.
 * ATENÇÃO: Use este middleware sempre após o 'authMiddleware'.
 */
const adminMiddleware = (req, res, next) => {
  // 1. Verifica se o objeto 'req.user' foi adicionado pelo authMiddleware.
  //    Esta é uma verificação de segurança extra.
  if (!req.user || !req.user.role) {
    return res.status(401).json({
      message: "Erro de autenticação. Dados do usuário não encontrados.",
    });
  }

  // 2. Verifica se o papel do usuário é 'admin'.
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Acesso negado. Esta rota é exclusiva para administradores.",
    });
    // Usamos 403 Forbidden, que significa "Eu sei quem você é, mas você não tem permissão".
  }

  // 3. Se o usuário for um admin, permite que a requisição continue.
  return next();
};

module.exports = adminMiddleware;

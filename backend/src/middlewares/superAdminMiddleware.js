// /backend/src/middlewares/superAdminMiddleware.js
const superAdminMiddleware = (req, res, next) => {
  if (req.user?.role !== "super_admin") {
    return res.status(403).json({
      message: "Acesso negado. Rota exclusiva.",
    });
  }
  return next();
};

module.exports = superAdminMiddleware;

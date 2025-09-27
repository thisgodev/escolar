const schoolService = require("../services/schoolService");

class SchoolController {
  /**
   * Lida com a requisição para criar uma nova escola.
   */
  async create(req, res) {
    try {
      // Extrai o objeto user do token
      const creatingUser = req.user;

      const { address, ...schoolInfo } = req.body;
      const school = await schoolService.createSchoolWithAddress(
        schoolInfo,
        address,
        creatingUser
      );

      res.status(201).json(school);
    } catch (error) {
      // ===== TRATAMENTO DE ERRO ESPECÍFICO =====
      // Verifica se o erro veio do driver do banco de dados e se o código é de violação de constraint única
      if (
        error.code === "23505" &&
        error.constraint === "schools_cnpj_unique"
      ) {
        // Retorna um erro 409 (Conflict), que é mais semântico para este caso
        return res
          .status(409)
          .json({ message: "Este CNPJ já está cadastrado no sistema." });
      }
      // ===========================================

      if (error.message.includes("Apenas administradores")) {
        return res.status(403).json({ message: error.message });
      }
      // Para outros erros, mantém o comportamento padrão
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar todas as escolas (respeitando o tenant).
   */
  async getAll(req, res) {
    try {
      const { tenantId } = req.query;
      const schools = await schoolService.getAllSchools(req.user, tenantId);
      res.status(200).json(schools);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar escolas.", error: error.message });
    }
  }

  async getById(req, res) {
    await schoolService.getById(req.params.id, req.user);
  }

  async update(req, res) {
    await schoolService.update(req.params.id, req.body, req.user);
  }
}

module.exports = new SchoolController();

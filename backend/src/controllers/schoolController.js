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
      // Retorna 403 (Forbidden) se a regra de negócio do serviço barrar a permissão
      if (error.message.includes("Apenas administradores")) {
        return res.status(403).json({ message: error.message });
      }
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar todas as escolas (respeitando o tenant).
   */
  async getAll(req, res) {
    try {
      // Passa o objeto user inteiro para o serviço
      const schools = await schoolService.getAllSchools(req.user);
      res.status(200).json(schools);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar escolas.", error: error.message });
    }
  }
}

module.exports = new SchoolController();

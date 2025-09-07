const schoolService = require("../services/schoolService");

class SchoolController {
  /**
   * Lida com a requisição para criar uma nova escola.
   */
  async create(req, res) {
    try {
      const { address, ...schoolInfo } = req.body;
      const school = await schoolService.createSchoolWithAddress(
        schoolInfo,
        address
      );
      res.status(201).json(school);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar todas as escolas.
   */
  async getAll(req, res) {
    try {
      const schools = await schoolService.getAllSchools();
      res.status(200).json(schools);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erro ao buscar escolas.", error: error.message });
    }
  }
}

module.exports = new SchoolController();

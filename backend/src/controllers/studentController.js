const studentService = require("../services/studentService");

class StudentController {
  /**
   * Cria um novo aluno.
   */
  async create(req, res) {
    try {
      // Passa o objeto 'user' inteiro do token para o serviço
      const creatingUser = req.user;
      const guardian_id = creatingUser.id;
      const { addresses, ...studentInfo } = req.body;

      if (!Array.isArray(addresses)) {
        return res
          .status(400)
          .json({ message: "O campo 'addresses' deve ser um array." });
      }

      const studentData = { ...studentInfo, guardian_id };

      const student = await studentService.createStudentWithAddresses(
        studentData,
        addresses,
        creatingUser
      );
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Busca os alunos de um responsável logado.
   */
  async getByGuardian(req, res) {
    try {
      // Passa o objeto 'user' inteiro
      const students = await studentService.getStudentsByGuardian(req.user);
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Busca todos os alunos (respeitando a regra de tenant).
   */
  async getAll(req, res) {
    try {
      // Passa o objeto 'user' inteiro
      const students = await studentService.getAllStudents(req.user);
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({
        message: "Erro ao buscar todos os alunos.",
        error: error.message,
      });
    }
  }

  async getAddresses(req, res) {
    try {
      const { id } = req.params;
      const addresses = await studentService.getStudentAddresses(id, req.user);
      res.status(200).json(addresses);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const student = await studentService.getStudentDetails(
        req.params.id,
        req.user
      );
      res.status(200).json(student);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      // Passa o req.body inteiro como o payload
      const student = await studentService.updateStudentWithAddresses(
        req.params.id,
        req.body,
        req.user
      );
      res.status(200).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = new StudentController();

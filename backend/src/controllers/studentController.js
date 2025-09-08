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
      const { address, ...studentInfo } = req.body;
      const studentData = { ...studentInfo, guardian_id };

      const student = await studentService.createStudentWithAddress(
        studentData,
        address,
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
}

module.exports = new StudentController();

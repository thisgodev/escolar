const studentService = require("../services/studentService");

class StudentController {
  /**
   * Lida com a requisição para criar um novo aluno.
   */
  async create(req, res) {
    try {
      // O ID do responsável é pego do token, garantindo a segurança.
      const guardian_id = req.user.id;
      const { address, ...studentInfo } = req.body;
      const studentData = { ...studentInfo, guardian_id };

      const student = await studentService.createStudentWithAddress(
        studentData,
        address
      );
      res.status(201).json(student);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar os alunos de um responsável logado.
   */
  async getByGuardian(req, res) {
    try {
      const guardian_id = req.user.id;
      const students = await studentService.getStudentsByGuardian(guardian_id);
      res.status(200).json(students);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Lida com a requisição para buscar todos os alunos (acesso de admin).
   */
  async getAll(req, res) {
    try {
      const students = await studentService.getAllStudents();
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

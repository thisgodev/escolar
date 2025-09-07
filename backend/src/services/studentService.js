const knex = require("../config/database");
const studentRepository = require("../repositories/studentRepository");

class StudentService {
  /**
   * Cria um aluno e seu endereço em uma única transação.
   * @param {object} studentData - Dados do aluno.
   * @param {object} addressData - Dados do endereço.
   * @returns {Promise<object>} O novo aluno criado.
   */
  async createStudentWithAddress(studentData, addressData) {
    if (
      !studentData.name ||
      !studentData.guardian_id ||
      !studentData.school_id
    ) {
      throw new Error("Dados do aluno incompletos.");
    }
    if (
      !addressData.logradouro ||
      !addressData.bairro ||
      !addressData.cidade ||
      !addressData.estado
    ) {
      throw new Error("Endereço do aluno incompleto.");
    }

    return knex.transaction(async (trx) => {
      const [newAddress] = await trx("addresses")
        .insert(addressData)
        .returning("id");
      const finalStudentData = { ...studentData, address_id: newAddress.id };
      const [newStudent] = await studentRepository.create(
        finalStudentData,
        trx
      );
      return newStudent;
    });
  }

  /**
   * Busca os alunos de um responsável específico.
   * @param {number} guardianId - ID do responsável.
   * @returns {Promise<object[]>}
   */
  async getStudentsByGuardian(guardianId) {
    return studentRepository.findByGuardianId(guardianId);
  }

  /**
   * Busca todos os alunos do sistema.
   * @returns {Promise<object[]>}
   */
  async getAllStudents() {
    return studentRepository.findAll();
  }
}

module.exports = new StudentService();

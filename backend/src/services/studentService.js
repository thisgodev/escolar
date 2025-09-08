const knex = require("../config/database");
const studentRepository = require("../repositories/studentRepository");

class StudentService {
  /**
   * Cria um aluno. O tenant_id vem do usuário que está criando.
   */
  async createStudentWithAddress(studentData, addressData, creatingUser) {
    if (!creatingUser.tenant_id) {
      throw new Error("Apenas usuários de um cliente podem cadastrar alunos.");
    }
    // Adiciona o tenant_id do usuário logado aos dados do aluno
    const studentDataWithTenant = {
      ...studentData,
      tenant_id: creatingUser.tenant_id,
    };

    return knex.transaction(async (trx) => {
      const addressDataWithTenant = {
        ...addressData,
        tenant_id: creatingUser.tenant_id,
      };
      const [newAddress] = await trx("addresses")
        .insert(addressDataWithTenant)
        .returning("id");
      const finalStudentData = {
        ...studentDataWithTenant,
        address_id: newAddress.id,
      };
      const [newStudent] = await studentRepository.create(
        finalStudentData,
        trx
      );
      return newStudent;
    });
  }

  /**
   * Busca alunos de um responsável.
   */
  async getStudentsByGuardian(user) {
    if (user.role === "super_admin") return []; // Super admin não tem "seus" alunos.
    return studentRepository.findByGuardianId(user.id, user.tenant_id);
  }

  /**
   * Busca todos os alunos. Se for super_admin, busca todos.
   * Se for um usuário normal, busca apenas os do seu tenant.
   */
  async getAllStudents(user) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;
    return studentRepository.findAll(tenantId);
  }
}

module.exports = new StudentService();

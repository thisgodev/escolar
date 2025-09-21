const knex = require("../config/database");
const studentRepository = require("../repositories/studentRepository");

class StudentService {
  /**
   * Cria um aluno. O tenant_id vem do usuário que está criando.
   */
  async createStudentWithAddresses(studentData, addresses, creatingUser) {
    const tenantId = creatingUser.tenant_id;
    if (!tenantId) {
      throw new Error("Ação não permitida para este perfil de usuário.");
    }
    // ... (validações)

    return knex.transaction(async (trx) => {
      // 1. Prepara os dados do aluno, garantindo que 'address_id' não esteja presente
      const studentPayload = {
        name: studentData.name,
        birth_date: studentData.birth_date,
        school_id: studentData.school_id,
        guardian_id: creatingUser.id,
        tenant_id: tenantId,
      };

      const [newStudent] = await trx("students")
        .insert(studentPayload) // Insere apenas os dados pertencentes à tabela 'students'
        .returning("*");

      // 2. Cria todos os endereços e as associações
      for (const addr of addresses) {
        const { label, ...addressData } = addr;
        const addressDataWithTenant = { ...addressData, tenant_id: tenantId };
        const [newAddress] = await trx("addresses")
          .insert(addressDataWithTenant)
          .returning("id");
        await trx("student_addresses").insert({
          student_id: newStudent.id,
          address_id: newAddress.id,
          label: label,
        });
      }
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

  async getStudentAddresses(studentId, user) {
    const tenantId = user.role === "super_admin" ? null : user.tenant_id;

    // Validação de segurança: Garante que o aluno consultado pertence ao mesmo tenant do admin.
    const student = await studentRepository.findById(studentId, tenantId);
    if (!student) {
      throw new Error("Aluno não encontrado ou acesso negado.");
    }

    // Busca os endereços na tabela de junção
    return knex("student_addresses as sa")
      .join("addresses as a", "sa.address_id", "a.id")
      .where("sa.student_id", studentId)
      .select(
        "a.id",
        "sa.label",
        "a.logradouro",
        "a.numero",
        "complemento",
        "bairro",
        "cidade",
        "estado"
      );
  }

  async getStudentDetails(studentId, user) {
    const tenantId = user.role === "guardian" ? user.tenant_id : null;
    const student = await studentRepository.findById(studentId, tenantId);
    if (!student) throw new Error("Aluno não encontrado ou acesso negado.");

    // Busca os endereços associados
    const addresses = await knex("student_addresses as sa")
      .join("addresses as a", "sa.address_id", "a.id")
      .where("sa.student_id", studentId)
      .select("a.*", "sa.label");

    return { ...student, addresses };
  }

  async updateStudentWithAddresses(studentId, payload, user) {
    const tenantId = user.tenant_id;
    if (!tenantId) {
      throw new Error("Ação não permitida.");
    }

    // Validação de segurança: Garante que o aluno a ser editado pertence ao tenant do usuário.
    const studentExists = await studentRepository.findById(studentId, tenantId);
    if (!studentExists) {
      throw new Error("Aluno não encontrado ou acesso negado.");
    }

    // Separa os dados que vão para a tabela 'students' dos que vão para 'addresses'
    const { addresses, ...studentData } = payload;

    const studentUpdatePayload = {
      name: studentData.name,
      birth_date: studentData.birth_date,
      school_id: studentData.school_id,
    };

    return knex.transaction(async (trx) => {
      // 1. ATUALIZA OS DADOS PRINCIPAIS DO ALUNO
      //    O payload `studentData` agora contém apenas 'name', 'birth_date', 'school_id'
      await studentRepository.update(
        studentId,
        tenantId,
        studentUpdatePayload,
        trx
      );

      // 2. APAGA TODOS OS ENDEREÇOS ANTIGOS ASSOCIADOS A ESTE ALUNO
      //    Esta é a forma mais simples de sincronizar os endereços.
      await trx("student_addresses").where({ student_id: studentId }).del();

      // 3. REINSERE OS NOVOS ENDEREÇOS (se houver algum)
      if (addresses && addresses.length > 0) {
        for (const addr of addresses) {
          const { label, ...addressData } = addr;
          // Se o endereço já tem um ID, podemos reutilizá-lo ou apenas criar novos.
          // Para simplificar, vamos sempre criar novos endereços na edição.
          delete addressData.id;

          const addressDataWithTenant = { ...addressData, tenant_id: tenantId };
          const [newAddress] = await trx("addresses")
            .insert(addressDataWithTenant)
            .returning("id");

          await trx("student_addresses").insert({
            student_id: studentId,
            address_id: newAddress.id,
            label: label,
          });
        }
      }

      // Retorna os dados atualizados do aluno
      return this.getStudentDetails(studentId, user);
    });
  }
}

module.exports = new StudentService();

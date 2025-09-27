const knex = require("../config/database");
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

class OnboardingService {
  /**
   * Processa uma matrícula completa: cria/atualiza o responsável, seu endereço
   * e cadastra todos os seus alunos de uma vez.
   * @param {object} data - O objeto completo do formulário.
   * @param {number} tenantId - O ID do cliente (empresa) ao qual a matrícula pertence.
   */
  async processMatricula(data, tenantId) {
    const { responsibleData, addressData, studentsData } = data;

    if (
      !responsibleData ||
      !addressData ||
      !studentsData ||
      studentsData.length === 0
    ) {
      throw new Error("Dados de matrícula incompletos.");
    }

    return knex.transaction(async (trx) => {
      // 1. Criar ou encontrar o endereço principal
      // Por simplicidade, vamos sempre criar um novo endereço para cada matrícula.
      const [address] = await trx("addresses")
        .insert({ ...addressData, tenant_id: tenantId })
        .returning("id");

      // 2. Criar ou encontrar o usuário responsável
      let responsibleUser = await trx("users")
        .where({ email: responsibleData.email, tenant_id: tenantId })
        .first();

      if (responsibleUser) {
        // Se o usuário já existe, atualiza os dados
        await trx("users")
          .where({ id: responsibleUser.id })
          .update({
            ...responsibleData,
            // Não atualizamos a senha aqui, apenas outros dados
            password: responsibleUser.password, // Mantém a senha existente
          });
      } else {
        // Se não existe, cria um novo
        const hashedPassword = await bcrypt.hash(responsibleData.password, 10);
        const [newUser] = await trx("users")
          .insert({
            ...responsibleData,
            password: hashedPassword,
            tenant_id: tenantId,
            role: "guardian",
          })
          .returning("*");
        responsibleUser = newUser;
      }

      // 3. Criar cada aluno associado ao responsável
      const createdStudents = [];
      for (const student of studentsData) {
        if (!student.name) continue; // Pula alunos vazios

        const studentPayload = {
          ...student,
          tenant_id: tenantId,
          guardian_id: responsibleUser.id,
        };
        const [newStudent] = await trx("students")
          .insert(studentPayload)
          .returning("*");
        createdStudents.push(newStudent);
      }

      // 4. (Opcional) Criar contratos em rascunho
      // Esta lógica pode ser adicionada aqui

      return { responsible: responsibleUser, students: createdStudents };
    });
  }
}

module.exports = new OnboardingService();

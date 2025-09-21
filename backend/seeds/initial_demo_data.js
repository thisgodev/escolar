const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // 1. Limpa todas as tabelas e reseta os contadores de ID
  await knex.raw(
    "TRUNCATE TABLE tenants, users, schools, addresses, vehicles, students, routes, routes_staff, routes_students, contracts, installments, invoices, daily_checks RESTART IDENTITY CASCADE"
  );

  // --- DADOS PARA O CLIENTE 1: Transporte Exemplo Ltda ---

  // 2. Cria o Cliente 1 (Tenant)
  const [tenant1] = await knex("tenants")
    .insert({
      company_name: "Transporte Exemplo Ltda",
      cpf_cnpj: "11.111.111/0001-11",
      contact_email: "contato@transporteexemplo.com",
      contact_phone: "41999991111",
    })
    .returning("*");

  // 3. Cria Usuários para o Cliente 1
  const hashedPassword = await bcrypt.hash("123456", 10);
  const [admin1] = await knex("users")
    .insert({
      tenant_id: tenant1.id,
      name: "Admin Exemplo",
      email: "admin@exemplo.com",
      password: hashedPassword,
      role: "admin",
      cpf: "111.111.111-11",
    })
    .returning("*");
  const [guardian1] = await knex("users")
    .insert({
      tenant_id: tenant1.id,
      name: "Ana Silva (Mãe)",
      email: "ana.mae@exemplo.com",
      password: hashedPassword,
      role: "guardian",
      cpf: "222.222.222-22",
    })
    .returning("*");
  const [driver1] = await knex("users")
    .insert({
      tenant_id: tenant1.id,
      name: "Carlos Rocha (Motorista)",
      email: "carlos.motorista@exemplo.com",
      password: hashedPassword,
      role: "driver",
      cpf: "333.333.333-33",
    })
    .returning("*");

  // 4. Cria Entidades para o Cliente 1
  const [address1_school] = await knex("addresses")
    .insert({
      tenant_id: tenant1.id,
      logradouro: "Rua das Flores",
      numero: "123",
      bairro: "Centro",
      cidade: "Curitiba",
      estado: "PR",
    })
    .returning("*");
  const [address1_student] = await knex("addresses")
    .insert({
      tenant_id: tenant1.id,
      logradouro: "Avenida das Palmeiras",
      numero: "456",
      bairro: "Batel",
      cidade: "Curitiba",
      estado: "PR",
    })
    .returning("*");
  const [school1] = await knex("schools")
    .insert({
      tenant_id: tenant1.id,
      name: "Colégio Aprender Mais",
      address_id: address1_school.id,
    })
    .returning("*");
  const [vehicle1] = await knex("vehicles")
    .insert({
      tenant_id: tenant1.id,
      placa: "ABC-1111",
      modelo: "Mercedes-Benz Sprinter",
      capacidade: 15,
    })
    .returning("*");

  // 5. Cria Aluno e o associa a um endereço
  const [student1] = await knex("students")
    .insert({
      tenant_id: tenant1.id,
      name: "Lucas Silva",
      guardian_id: guardian1.id,
      school_id: school1.id,
    })
    .returning("*");
  await knex("student_addresses").insert({
    student_id: student1.id,
    address_id: address1_student.id,
    label: "Casa Principal",
  });

  // 6. Cria Rota e Associações
  const [route1] = await knex("routes")
    .insert({
      tenant_id: tenant1.id,
      name: "Rota Manhã - Batel/Centro",
      school_id: school1.id,
    })
    .returning("*");
  await knex("routes_staff").insert({
    tenant_id: tenant1.id,
    route_id: route1.id,
    user_id: driver1.id,
    assignment_type: "main_driver",
  });
  await knex("routes_students").insert({
    tenant_id: tenant1.id,
    route_id: route1.id,
    student_id: student1.id,
    pickup_address_id: address1_student.id,
    dropoff_address_id: address1_school.id,
    weekdays: JSON.stringify(["seg", "qua", "sex"]),
  });

  // 7. Cria Contrato e Parcelas
  const [contract1] = await knex("contracts")
    .insert({
      tenant_id: tenant1.id,
      guardian_id: guardian1.id,
      student_id: student1.id,
      installments_count: 12,
      installment_value: 350.0,
      first_due_date: new Date(),
      due_day: 10,
    })
    .returning("*");
  const installments1 = [];
  for (let i = 0; i < contract1.installments_count; i++) {
    const dueDate = new Date(contract1.first_due_date);
    dueDate.setUTCMonth(dueDate.getUTCMonth() + i);
    installments1.push({
      tenant_id: tenant1.id,
      contract_id: contract1.id,
      installment_number: i + 1,
      due_date: dueDate,
      base_value: contract1.installment_value,
      status: i < 2 ? "paid" : "pending", // Simula 2 parcelas pagas
      paid_value: i < 2 ? 350.0 : null,
      payment_date: i < 2 ? new Date() : null,
    });
  }
  await knex("installments").insert(installments1);

  // --- DADOS PARA O CLIENTE 2: Escolares ABC ---

  const [tenant2] = await knex("tenants")
    .insert({
      company_name: "Escolares ABC",
      cpf_cnpj: "22.222.222/0001-22",
      contact_email: "adm@escolaresabc.com",
      contact_phone: "41988882222",
    })
    .returning("*");

  const [admin2] = await knex("users")
    .insert({
      tenant_id: tenant2.id,
      name: "Fernanda Lima",
      email: "fernanda@escolaresabc.com",
      password: hashedPassword,
      role: "admin",
      cpf: "444.444.444-44",
    })
    .returning("*");
  const [guardian2] = await knex("users")
    .insert({
      tenant_id: tenant2.id,
      name: "Roberto Costa (Pai)",
      email: "roberto.pai@exemplo.com",
      password: hashedPassword,
      role: "guardian",
      cpf: "555.555.555-55",
    })
    .returning("*");
  const [driver2] = await knex("users")
    .insert({
      tenant_id: tenant2.id,
      name: "João Pereira (Motorista)",
      email: "joao.motorista@exemplo.com",
      password: hashedPassword,
      role: "driver",
      cpf: "666.666.666-66",
    })
    .returning("*");

  const [address2_school] = await knex("addresses")
    .insert({
      tenant_id: tenant2.id,
      logradouro: "Avenida Sete de Setembro",
      numero: "2000",
      bairro: "Água Verde",
      cidade: "Curitiba",
      estado: "PR",
    })
    .returning("*");
  const [address2_student] = await knex("addresses")
    .insert({
      tenant_id: tenant2.id,
      logradouro: "Rua da Paz",
      numero: "789",
      bairro: "Portão",
      cidade: "Curitiba",
      estado: "PR",
    })
    .returning("*");
  const [school2] = await knex("schools")
    .insert({
      tenant_id: tenant2.id,
      name: "Escola Mundo Feliz",
      address_id: address2_school.id,
    })
    .returning("*");
  const [vehicle2] = await knex("vehicles")
    .insert({
      tenant_id: tenant2.id,
      placa: "XYZ-2222",
      modelo: "Renault Master",
      capacidade: 18,
    })
    .returning("*");

  const [student2] = await knex("students")
    .insert({
      tenant_id: tenant2.id,
      name: "Mariana Costa",
      guardian_id: guardian2.id,
      school_id: school2.id,
    })
    .returning("*");
  await knex("student_addresses").insert({
    student_id: student2.id,
    address_id: address2_student.id,
    label: "Casa",
  });

  const [route2] = await knex("routes")
    .insert({
      tenant_id: tenant2.id,
      name: "Rota Tarde - Portão/Água Verde",
      school_id: school2.id,
    })
    .returning("*");
  await knex("routes_staff").insert({
    tenant_id: tenant2.id,
    route_id: route2.id,
    user_id: driver2.id,
    assignment_type: "main_driver",
  });
  await knex("routes_students").insert({
    tenant_id: tenant2.id,
    route_id: route2.id,
    student_id: student2.id,
    pickup_address_id: address2_student.id,
    dropoff_address_id: address2_school.id,
    weekdays: JSON.stringify(["seg", "ter", "qua", "qui", "sex"]),
  });
};

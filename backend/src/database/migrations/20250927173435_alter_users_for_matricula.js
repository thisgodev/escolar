exports.up = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.string("rg");
    table.date("birth_date");
    table.string("cpf").notNullable().alter(); // Torna a coluna obrigatória
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable("users", (table) => {
    table.dropColumn("rg");
    table.dropColumn("birth_date");
    table.string("cpf").nullable().alter();
  });
};

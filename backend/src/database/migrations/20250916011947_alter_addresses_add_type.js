exports.up = function (knex) {
  return knex.schema.alterTable("addresses", (table) => {
    table
      .enum("type", ["endereco", "ponto_de_encontro", "outro"])
      .notNullable()
      .defaultTo("endereco");
    table.string("name"); // Nome para o Ponto de Encontro, ex: "Praça Central"
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable("addresses", (table) => {
    table.dropColumn("type");
    table.dropColumn("name");
  });
};

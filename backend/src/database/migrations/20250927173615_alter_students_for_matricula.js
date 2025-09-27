exports.up = function (knex) {
  return knex.schema.alterTable("students", (table) => {
    table.string("series_turma");
    table.enum("periodo", ["manha", "tarde", "integral"]);
    table.date("start_date");
  });
};
exports.down = function (knex) {
  return knex.schema.alterTable("students", (table) => {
    table.dropColumn("series_turma");
    table.dropColumn("periodo");
    table.dropColumn("start_date");
  });
};

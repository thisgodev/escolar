exports.up = function (knex) {
  return knex.schema.alterTable("tenants", (table) => {
    table.integer("main_address_id").nullable().alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tenants", (table) => {
    table.integer("main_address_id").notNullable().alter();
  });
};

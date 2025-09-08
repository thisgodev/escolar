exports.up = async function (knex) {
  const tables = [
    "users",
    "schools",
    "students",
    "routes",
    "contracts",
    "invoices",
    "daily_checks",
    "addresses",
  ];

  for (const table of tables) {
    await knex.schema.table(table, (t) => {
      t.integer("tenant_id")
        .unsigned()
        .references("id")
        .inTable("tenants")
        .onDelete("CASCADE")
        .notNullable();
    });
  }
};

exports.down = async function (knex) {
  const tables = [
    "users",
    "schools",
    "students",
    "routes",
    "contracts",
    "vehicles",
    "invoices",
    "daily_checks",
    "addresses",
  ];
  for (const table of tables) {
    await knex.schema.table(table, (t) => {
      t.dropColumn("tenant_id");
    });
  }
};

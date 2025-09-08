// /backend/src/database/migrations/TIMESTAMP_create_daily_checks_table.js
exports.up = function (knex) {
  return knex.schema.createTable("daily_checks", (table) => {
    table.increments("id").primary();
    table
      .integer("route_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("routes")
      .onDelete("CASCADE");
    table
      .integer("student_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("students")
      .onDelete("CASCADE");
    table.date("check_date").notNullable();
    table.enum("trip_leg", ["ida", "volta"]).notNullable();
    table.enum("status", ["presente", "ausente", "justificado"]).notNullable();
    table.text("notes");
    table
      .integer("checked_by_user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table.timestamp("checked_at").defaultTo(knex.fn.now());
    table.unique(["student_id", "check_date", "trip_leg"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("daily_checks");
};

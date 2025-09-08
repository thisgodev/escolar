exports.up = function (knex) {
  const roles = "('admin', 'guardian', 'driver', 'monitor', 'super_admin')";

  return knex.raw(`
    ALTER TABLE users
    DROP CONSTRAINT users_role_check,
    ADD CONSTRAINT users_role_check CHECK (role IN ${roles});
  `);
};

exports.down = function (knex) {
  const oldRoles = "('admin', 'guardian', 'driver', 'monitor')";
  return knex.raw(`
    ALTER TABLE users
    DROP CONSTRAINT users_role_check,
    ADD CONSTRAINT users_role_check CHECK (role IN ${oldRoles});
  `);
};

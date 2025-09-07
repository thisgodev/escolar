const knex = require("../config/database"); // Precisamos criar este arquivo

class UserRepository {
  async findByEmail(email) {
    return knex("users").where({ email }).first();
  }

  async create(userData) {
    const [user] = await knex("users").insert(userData).returning("*");
    return user;
  }
}

module.exports = new UserRepository();

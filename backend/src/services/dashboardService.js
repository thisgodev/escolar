const knex = require("../config/database");

class DashboardService {
  async getAdminSummary() {
    const [totalStudents] = await knex("students").count("id as count");
    const [totalRoutes] = await knex("routes").count("id as count");
    const [totalGuardians] = await knex("users")
      .where({ role: "guardian" })
      .count("id as count");
    const [pendingInstallments] = await knex("installments")
      .where({ status: "pending" })
      .sum("base_value as total");
    return {
      totalStudents: totalStudents.count,
      totalRoutes: totalRoutes.count,
      totalGuardians: totalGuardians.count,
      pendingInstallments: pendingInstallments.total || 0,
    };
  }

  async getGuardianSummary(guardianId) {
    const myStudents = await knex("students")
      .where({ guardian_id: guardianId })
      .select("id", "name");
    return { myStudents };
  }

  async getDriverSummary(driverId) {
    const myRoutes = await knex("routes_staff as rs")
      .join("routes as r", "rs.route_id", "r.id")
      .where("rs.user_id", driverId)
      .select("r.id", "r.name");
    return { myRoutes };
  }
}

module.exports = new DashboardService();

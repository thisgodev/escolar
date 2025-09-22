const knex = require("../config/database");

class DashboardService {
  async getAdminSummary(tenantId) {
    // Ele já recebia o tenantId, agora vamos usá-lo em tudo
    if (!tenantId) {
      // Retorna valores zerados se por algum motivo um admin não tiver tenantId
      return {
        totalStudents: 0,
        totalRoutes: 0,
        activeVehicles: 0,
        paidThisMonth: 0,
        pendingThisMonth: 0,
        monthlyRevenue: [],
      };
    }

    // Cria uma função base para adicionar o '.where({ tenant_id: tenantId })'
    const baseQuery = (table) => knex(table).where({ tenant_id: tenantId });

    const [totalStudents] = await baseQuery("contracts")
      .where({ status: "active" })
      .countDistinct("student_id as count");
    const [totalRoutes] = await baseQuery("routes").count("id as count");
    const [activeVehicles] = await baseQuery("vehicles")
      .where({ status: "ativo" })
      .count("id as count");

    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [paidThisMonth] = await baseQuery("installments")
      .where({ status: "paid" })
      .andWhereBetween("payment_date", [firstDayOfMonth, lastDayOfMonth])
      .sum("paid_value as total");

    const [pendingThisMonth] = await baseQuery("installments")
      .where({ status: "pending" })
      .andWhere("due_date", "<=", lastDayOfMonth)
      .sum("base_value as total");

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await baseQuery("installments")
      .select(
        knex.raw("to_char(payment_date, 'YYYY-MM') as month"),
        knex.raw("sum(paid_value) as revenue")
      )
      .where("status", "paid")
      .andWhere("payment_date", ">=", sixMonthsAgo)
      .groupBy("month")
      .orderBy("month", "asc");

    return {
      totalStudents: totalStudents.count,
      totalRoutes: totalRoutes.count,
      activeVehicles: activeVehicles.count,
      paidThisMonth: paidThisMonth.total || 0,
      pendingThisMonth: pendingThisMonth.total || 0,
      monthlyRevenue: monthlyRevenue,
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

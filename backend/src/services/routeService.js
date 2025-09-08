const knex = require("../config/database");
const routeRepository = require("../repositories/routeRepository");
const studentRepository = require("../repositories/studentRepository"); // Importe o studentRepository
const userRepository = require("../repositories/userRepository"); // Importe o userRepository

class RouteService {
  async createRoute(routeData) {
    if (!routeData.name || !routeData.school_id) {
      throw new Error("Nome da rota e escola são obrigatórios.");
    }
    const [newRoute] = await routeRepository.create(routeData);
    return newRoute;
  }

  async getAllRoutes() {
    return routeRepository.getAll();
  }

  async getRouteById(id) {
    const route = await routeRepository.findById(id);
    if (!route) throw new Error("Rota não encontrada.");

    const students = await knex("routes_students")
      .join("students", "routes_students.student_id", "students.id")
      .where("routes_students.route_id", id)
      .select("students.id", "students.name", "routes_students.trip_type");

    const staff = await knex("routes_staff")
      .join("users", "routes_staff.user_id", "users.id")
      .where("routes_staff.route_id", id)
      .select(
        "users.id",
        "users.name",
        "users.role",
        "routes_staff.assignment_type"
      );

    return { ...route, students, staff };
  }

  async addStudentToRoute(routeId, studentId, tripType, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Ação não permitida.");
    }

    // ===== VALIDAÇÃO EXTRA =====
    // 1. Verifica se a rota existe e pertence ao tenant do admin.
    const route = await routeRepository.findById(routeId, tenantId);
    if (!route) {
      throw new Error("Rota não encontrada ou acesso negado.");
    }

    // 2. Verifica se o aluno existe e pertence ao mesmo tenant.
    const student = await studentRepository.findById(studentId, tenantId);
    if (!student) {
      throw new Error("Aluno não encontrado ou não pertence a este cliente.");
    }
    // ===========================

    return knex("routes_students")
      .insert({ route_id: routeId, student_id: studentId, trip_type: tripType })
      .onConflict(["route_id", "student_id"])
      .merge()
      .returning("*");
  }

  async addStaffToRoute(routeId, staffUserId, assignmentType, user) {
    const tenantId = user.tenant_id;
    if (user.role !== "admin" || !tenantId) {
      throw new Error("Ação não permitida.");
    }

    // ===== VALIDAÇÃO EXTRA =====
    const route = await routeRepository.findById(routeId, tenantId);
    if (!route) {
      throw new Error("Rota não encontrada ou acesso negado.");
    }

    const staffMember = await userRepository.findById(staffUserId); // Busca o usuário a ser adicionado
    // Verifica se o membro da equipe existe e pertence ao mesmo tenant da rota/admin
    if (!staffMember || staffMember.tenant_id !== tenantId) {
      throw new Error(
        "Membro da equipe não encontrado ou não pertence a este cliente."
      );
    }

    return knex("routes_staff")
      .insert({
        route_id: routeId,
        user_id: staffUserId,
        assignment_type: assignmentType,
      })
      .onConflict(["route_id", "user_id"])
      .merge()
      .returning("*");
  }

  async getChecklistForDate(routeId, date) {
    const routeInfo = await knex("routes")
      .where({ id: routeId })
      .select("id", "name", "estimated_duration_seconds")
      .first();
    if (!routeInfo) throw new Error("Informações da rota não encontradas.");

    const students = await knex("routes_students as rs")
      .join("students as s", "rs.student_id", "s.id")
      .join("addresses as a", "s.address_id", "a.id")
      .leftJoin("daily_checks as dc", function () {
        this.on("rs.student_id", "=", "dc.student_id").andOn(
          knex.raw("dc.check_date = ?", [date])
        );
      })
      .where("rs.route_id", routeId)
      .select(
        "s.id",
        "s.name",
        "rs.trip_type",
        "rs.pickup_order",
        "a.logradouro",
        "a.numero",
        knex.raw(
          `json_agg(json_build_object('leg', dc.trip_leg, 'status', dc.status)) filter (where dc.id is not null) as checks_today`
        )
      )
      .groupBy(
        "s.id",
        "rs.trip_type",
        "rs.pickup_order",
        "a.logradouro",
        "a.numero"
      )
      .orderBy("rs.pickup_order", "asc");

    return { routeInfo, students };
  }

  async performCheck(checkData) {
    return knex("daily_checks")
      .insert(checkData)
      .onConflict(["student_id", "check_date", "trip_leg"])
      .merge()
      .returning("*");
  }
}

module.exports = new RouteService();

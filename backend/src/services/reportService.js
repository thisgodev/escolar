const knex = require("../config/database");
const PDFDocument = require("pdfkit");

class ReportService {
  async generateStudentFrequencyPDF(studentId, month, year, tenantId) {
    // 1. Busca os dados necessários
    const student = await knex("students")
      .where({ id: studentId, tenant_id: tenantId })
      .first();
    const checks = await knex("daily_checks")
      .where({ student_id: studentId, tenant_id: tenantId })
      .andWhereRaw("extract(month from check_date) = ?", [month])
      .andWhereRaw("extract(year from check_date) = ?", [year])
      .orderBy("check_date", "asc");

    // 2. Cria o documento PDF
    const doc = new PDFDocument({ margin: 50 });
    doc
      .fontSize(20)
      .text(`Relatório de Frequência - ${student.name}`, { align: "center" });
    doc.fontSize(12).text(`Mês/Ano: ${month}/${year}\n\n`);

    checks.forEach((check) => {
      const date = new Date(check.check_date).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });
      const text = `Data: ${date} | Trecho: ${check.trip_leg} | Status: ${check.status}`;
      doc.fontSize(10).text(text);
    });

    return doc;
  }
}
module.exports = new ReportService();

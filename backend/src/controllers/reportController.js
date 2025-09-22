const reportService = require("../services/reportService");
class ReportController {
  async getStudentFrequency(req, res) {
    try {
      const { studentId, month, year } = req.query;
      const doc = await reportService.generateStudentFrequencyPDF(
        studentId,
        month,
        year,
        req.user.tenant_id
      );

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=relatorio_${studentId}.pdf`
      );

      doc.pipe(res);
      doc.end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
module.exports = new ReportController();

// /backend/src/utils/statusHelper.js
function getInstallmentStatus(installment) {
  if (installment.status === "paid") {
    return "pago";
  }
  if (installment.status === "cancelled") {
    return "cancelado";
  }

  const today = new Date();
  const dueDate = new Date(installment.due_date);

  // Zera as horas para comparar apenas as datas
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (today > dueDate) {
    return "vencido"; // 'overdue'
  }

  return "pendente"; // 'pending'
}

module.exports = { getInstallmentStatus };

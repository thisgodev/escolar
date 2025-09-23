import { Badge } from "./ui/badge";
import { type InstallmentStatus } from "../types"; // Importe o tipo

interface StatusBadgeProps {
  status: InstallmentStatus;
  paymentDate?: string | null;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function StatusBadge({ status, paymentDate }: StatusBadgeProps) {
  const statusConfig: Record<
    InstallmentStatus,
    { text: string; variant: BadgeVariant; className?: string }
  > = {
    paid: {
      text: `Pago em ${new Date(paymentDate!).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })}`,
      variant: "default",
      className: "bg-green-600 text-white",
    },
    pending: {
      text: "Pendente",
      variant: "secondary",
      className: "bg-yellow-500 text-white",
    },
    overdue: { text: "Vencido", variant: "destructive" },
    cancelled: { text: "Cancelado", variant: "outline" },
    sem_parcela: { text: "Sem Parcela no Mês", variant: "outline" },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.text}
    </Badge>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dados de exemplo para o gráfico. No futuro, isso virá da sua API.
const monthlyRevenueData = [
  { name: "Jan", faturamento: 4000 },
  { name: "Fev", faturamento: 3000 },
  { name: "Mar", faturamento: 5000 },
  { name: "Abr", faturamento: 4500 },
  { name: "Mai", faturamento: 6000 },
  { name: "Jun", faturamento: 5800 },
];

type AdminSummary = {
  pendingInstallments: number | null;
  totalStudents: number | null;
  totalRoutes: number | null;
};
interface AdminDashboardProps {
  summary: AdminSummary | null;
  totalStudents?: number;
}

export function AdminDashboard({ summary }: AdminDashboardProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (value === null || value === undefined) return "R$0,00";
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      {/* Coluna Principal com Gráfico */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Faturamento Mensal (Exemplo)</CardTitle>
            <CardDescription>
              Visão geral da receita nos últimos 6 meses.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `R$${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="faturamento"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Coluna Lateral com Cards de Resumo */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Pendente Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(summary?.pendingInstallments)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalStudents || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Rotas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary?.totalRoutes || 0}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Users, Car, DollarSign, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// Tipos para os dados que o componente recebe do backend
type MonthlyRevenueData = {
  month: string; // ex: "2025-08"
  revenue: number;
};

type AdminSummary = {
  totalStudents: number;
  totalRoutes: number;
  activeVehicles: number;
  paidThisMonth: number;
  pendingThisMonth: number;
  monthlyRevenue: MonthlyRevenueData[];
};

interface AdminDashboardProps {
  summary: AdminSummary | null;
}

// Função para formatar os dados do gráfico (de "2025-08" para "Ago")
const formatChartData = (data: MonthlyRevenueData[] = []) => {
  const monthNames = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];
  return data.map((item) => {
    const monthIndex = parseInt(item.month.split("-")[1], 10) - 1;
    return {
      name: monthNames[monthIndex],
      Faturamento: item.revenue,
    };
  });
};

// Função para formatar valores monetários
const formatCurrency = (value: number | null | undefined) => {
  if (value == null) return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export function AdminDashboard({ summary }: AdminDashboardProps) {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("6m");
  // const [chartView, setChartView] = useState<"revenue" | "status">("revenue");

  const formattedData = formatChartData(summary?.monthlyRevenue);

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Card Clicável: A Receber (Mês) */}
      <Card
        onClick={() => navigate("/contracts?status=pending")} // Futuramente: /financials/pending
        className="cursor-pointer transition-all hover:border-primary/80 hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">A Receber (Mês)</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary?.pendingThisMonth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Parcelas pendentes no mês atual
          </p>
        </CardContent>
      </Card>

      {/* Card Clicável: Recebido no Mês */}
      <Card
        onClick={() => navigate("/contracts?status=paid")} // Futuramente: /financials/paid
        className="cursor-pointer transition-all hover:border-primary/80 hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Recebido (Mês)</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary?.paidThisMonth)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total pago no mês atual
          </p>
        </CardContent>
      </Card>

      {/* Card Clicável: Total de Alunos */}
      <Card
        onClick={() => navigate("/contracts")} // O melhor lugar para ver os alunos é nos contratos
        className="cursor-pointer transition-all hover:border-primary/80 hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary?.totalStudents || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Alunos com contrato ativo
          </p>
        </CardContent>
      </Card>

      {/* Card Clicável: Veículos Ativos */}
      <Card
        onClick={() => navigate("/vehicles")}
        className="cursor-pointer transition-all hover:border-primary/80 hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Veículos Ativos</CardTitle>
          <Car className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {summary?.activeVehicles || 0}
          </div>
          <p className="text-xs text-muted-foreground">Veículos da sua frota</p>
        </CardContent>
      </Card>

      {/* Card do Gráfico */}
      <div className="md:col-span-2 lg:col-span-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Visão Geral Financeira</CardTitle>
                <CardDescription>
                  Acompanhe a performance do seu negócio.
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    {dateRange === "6m" && "Últimos 6 Meses"}
                    {dateRange === "30d" && "Últimos 30 Dias"}
                    {dateRange === "12m" && "Último Ano"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateRange("30d")}>
                    Últimos 30 Dias
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange("6m")}>
                    Últimos 6 Meses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange("12m")}>
                    Último Ano
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="h-[350px] w-full p-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedData}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="name"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `R$${value / 1000}k`}
                />
                <Tooltip
                  cursor={{
                    stroke: "hsl(var(--primary))",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="Faturamento"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

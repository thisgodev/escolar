import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../hooks/useAuth";
import { AdminDashboard } from "../components/dashboards/AdminDashboard";
import { GuardianDashboard } from "../components/dashboards/GuardianDashboard";
import { DriverDashboard } from "../components/dashboards/DriverDashboard";
import { Skeleton } from "../components/ui/skeleton"; // Para um efeito de loading melhor

export function DashboardPage() {
  const { user } = useAuth();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      api
        .get("/dashboard/summary")
        .then((res) => setSummary(res.data))
        .catch((error) =>
          console.error("Falha ao buscar resumo do dashboard:", error)
        )
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const renderDashboardByRole = () => {
    if (!user || !summary) return null;

    switch (user.role) {
      case "admin":
        return <AdminDashboard summary={summary} />;
      case "guardian":
        return <GuardianDashboard summary={summary} />;
      case "driver":
      case "monitor":
        return <DriverDashboard summary={summary} />;
      default:
        return <p>Dashboard não disponível para seu perfil.</p>;
    }
  };

  // Efeito de Skeleton Loading para uma melhor UX
  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Seu Dashboard</h1>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Skeleton className="h-[350px] w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
            <Skeleton className="h-[100px] w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Bem-vindo(a) de volta, {user?.name}!
      </h1>
      {renderDashboardByRole()}
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { ListChecks, Route } from "lucide-react";

type DriverSummary = {
  myRoutes: {
    id: number;
    name: string;
  }[];
};

interface DriverDashboardProps {
  summary: DriverSummary | null;
}

export function DriverDashboard({ summary }: DriverDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Card: Iniciar Checklist */}
      <Card className="bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle>Operação do Dia</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Acesse o checklist para iniciar sua rota.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/checklist">
            <Button variant="secondary" className="w-full">
              <ListChecks className="h-4 w-4 mr-2" />
              Realizar Checklist
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Card: Minhas Rotas */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Rotas Atribuídas</CardTitle>
          <CardDescription>Rotas sob sua responsabilidade.</CardDescription>
        </CardHeader>
        <CardContent>
          {summary?.myRoutes && summary.myRoutes.length > 0 ? (
            <ul className="divide-y">
              {summary.myRoutes.map((route) => (
                <li
                  key={route.id}
                  className="py-2 font-medium flex items-center"
                >
                  <Route className="h-4 w-4 mr-3 text-muted-foreground" />
                  {route.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma rota atribuída a você.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

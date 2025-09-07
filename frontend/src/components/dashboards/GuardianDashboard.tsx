import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { UserPlus } from "lucide-react";
import { Link } from "react-router-dom";

type GuardianSummary = {
  myStudents: {
    id: number;
    name: string;
  }[];
};

interface GuardianDashboardProps {
  summary: GuardianSummary | null;
}

export function GuardianDashboard({ summary }: GuardianDashboardProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Card: Meus Alunos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meus Alunos</CardTitle>
              <CardDescription>
                Visualize e gerencie seus dependentes.
              </CardDescription>
            </div>
            {/* Futuramente, este botão pode abrir o modal de cadastro diretamente */}
            <Link to="/students">
              <Button size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Gerenciar
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {summary?.myStudents && summary.myStudents.length > 0 ? (
            <ul className="divide-y">
              {summary.myStudents.map((student) => (
                <li key={student.id} className="py-2 font-medium">
                  {student.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum aluno cadastrado.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Card: Financeiro (Exemplo Futuro) */}
      <Card>
        <CardHeader>
          <CardTitle>Meu Financeiro</CardTitle>
          <CardDescription>Acesse suas faturas e pagamentos.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Funcionalidade em breve.
          </p>
          <Button disabled className="mt-4">
            Ver Faturas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

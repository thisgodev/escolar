import { useEffect, useState, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { AddStudentToRouteForm } from "../components/AddStudentToRouteForm";
import { AddStaffToRouteForm } from "../components/AddStaffToRouteForm";
import { Skeleton } from "../components/ui/skeleton";
import { UserPlus } from "lucide-react";

// Tipos
type StudentOnRoute = { id: number; name: string; trip_type: string };
type StaffOnRoute = { id: number; name: string; assignment_type: string };
type RouteDetails = {
  id: number;
  name: string;
  students: StudentOnRoute[];
  staff: StaffOnRoute[];
};

export function RouteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStudentFormOpen, setIsStudentFormOpen] = useState(false);
  const [isStaffFormOpen, setIsStaffFormOpen] = useState(false);

  const fetchRouteDetails = useCallback(() => {
    if (id) {
      api
        .get(`/routes/${id}`)
        .then((response) => setRoute(response.data))
        .catch((error) =>
          console.error("Falha ao buscar detalhes da rota", error)
        )
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    fetchRouteDetails();
  }, [fetchRouteDetails]);

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-12 w-1/2 mb-8" />
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="container mx-auto p-4 md:p-8">
        <Link to="/routes">
          <Button variant="ghost" className="mb-6">
            &larr; Voltar
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-destructive">
          Rota não encontrada.
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/routes">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar para Rotas
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-8">
        Gerenciar Rota: <span className="text-primary">{route.name}</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Card de Alunos */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Alunos na Rota</CardTitle>
            </div>
            <Dialog
              open={isStudentFormOpen}
              onOpenChange={setIsStudentFormOpen}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Aluno à Rota</DialogTitle>
                </DialogHeader>
                <AddStudentToRouteForm
                  routeId={route.id}
                  onStudentAdded={fetchRouteDetails}
                  closeDialog={() => setIsStudentFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {route.students && route.students.length > 0 ? (
              <ul className="divide-y divide-border">
                {route.students.map((student) => (
                  <li
                    key={student.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <span>{student.name}</span>
                    <span className="text-sm capitalize text-muted-foreground">
                      {student.trip_type.replace(/_/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4">
                Nenhum aluno nesta rota.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card da Equipe */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl">Equipe da Rota</CardTitle>
            </div>
            <Dialog open={isStaffFormOpen} onOpenChange={setIsStaffFormOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Membro da Equipe</DialogTitle>
                </DialogHeader>
                <AddStaffToRouteForm
                  routeId={route.id}
                  onStaffAdded={fetchRouteDetails}
                  closeDialog={() => setIsStaffFormOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {route.staff && route.staff.length > 0 ? (
              <ul className="divide-y divide-border">
                {route.staff.map((member) => (
                  <li
                    key={member.id}
                    className="py-3 flex justify-between items-center"
                  >
                    <span>{member.name}</span>
                    <span className="text-sm font-semibold capitalize text-muted-foreground">
                      {member.assignment_type.replace(/_/g, " ")}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground py-4">
                Nenhum membro nesta rota.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

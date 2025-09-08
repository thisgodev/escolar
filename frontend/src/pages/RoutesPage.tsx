import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { RouteForm } from "../components/RouteForm";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

type Route = {
  id: number;
  name: string;
  description: string | null;
  school_name: string;
};

export function RoutesPage() {
  const navigate = useNavigate();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchRoutes = () => {
    api.get("/routes").then((response) => {
      setRoutes(response.data);
    });
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleRouteCreated = () => {
    fetchRoutes();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Rotas</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Nova Rota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Rota</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para criar uma nova rota no
                sistema.
              </DialogDescription>
            </DialogHeader>
            <RouteForm
              onRouteCreated={handleRouteCreated}
              closeDialog={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Nome da Rota</TableHead>
              <TableHead>Escola de Destino</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.length > 0 ? (
              routes.map((route) => (
                <TableRow
                  key={route.id}
                  onClick={() => navigate(`/routes/${route.id}`)}
                  className="cursor-pointer transition-colors hover:bg-accent/50"
                >
                  <TableCell className="font-medium">{route.name}</TableCell>
                  <TableCell>{route.school_name}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  Nenhuma rota cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

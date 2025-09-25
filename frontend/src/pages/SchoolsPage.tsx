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
import { SchoolForm } from "../components/SchoolForm";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

type School = { id: number; name: string; cnpj: string | null };

function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchSchools = () => {
    api.get("/schools").then((response) => setSchools(response.data));
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleSchoolCreated = (newSchool: School) => {
    setSchools((prevSchools) => [...prevSchools, newSchool]);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Escolas</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Nova Escola
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Nova Escola</DialogTitle>
              <DialogDescription>
                Preencha as informações abaixo para cadastrar uma nova escola no
                sistema.
              </DialogDescription>
            </DialogHeader>
            <SchoolForm
              onSchoolCreated={handleSchoolCreated}
              closeDialog={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>ID</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>CNPJ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schools.length > 0 ? (
              schools.map((school) => (
                <TableRow key={school.id}>
                  <TableCell>{school.id}</TableCell>
                  <TableCell className="font-medium">{school.name}</TableCell>
                  <TableCell>{school.cnpj || "Não informado"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center text-muted-foreground"
                >
                  Nenhuma escola cadastrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default SchoolsPage;

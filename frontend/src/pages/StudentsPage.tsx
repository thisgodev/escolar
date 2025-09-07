import { useEffect, useState } from "react";
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
import { StudentForm } from "../components/StudentForm";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

// Tipos
type Student = {
  id: number;
  name: string;
  guardian_id: number;
  school_id: number;
  address_id: number;
};

export function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchStudents = () => {
    api.get("/students").then((response) => setStudents(response.data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentCreated = (newStudent: Student) => {
    setStudents((prevStudents) => [...prevStudents, newStudent]);
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <Link to="/dashboard">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Alunos</h1>

        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <PlusCircle className="h-4 w-4 mr-2" />
              Adicionar Novo Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Aluno</DialogTitle>
            </DialogHeader>
            <StudentForm
              onStudentCreated={handleStudentCreated}
              closeDialog={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Alunos</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <ul className="divide-y divide-border">
              {students.map((student) => (
                <li
                  key={student.id}
                  className="py-3 font-medium text-foreground"
                >
                  {student.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Você ainda não tem alunos cadastrados.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

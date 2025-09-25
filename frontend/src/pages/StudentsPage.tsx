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
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { StudentForm } from "../components/StudentForm";
import { useNavigate } from "react-router-dom";
import { PlusCircle, User } from "lucide-react";
import { type Student } from "../types"; // Importando o tipo centralizado

function StudentsPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchStudents = () => {
    api.get("/students").then((response) => setStudents(response.data));
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Esta função agora não precisa mais de um argumento,
  // pois o formulário apenas notifica o sucesso, e a página busca os dados atualizados.
  const handleFormSubmit = () => {
    fetchStudents();
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
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
              <DialogDescription>
                Preencha os dados abaixo para adicionar um novo dependente.
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              // 1. O NOME DA PROP FOI CORRIGIDO
              onFormSubmit={handleFormSubmit}
              closeDialog={() => setIsFormOpen(false)}
              // 2. Não passamos 'studentToEdit' aqui, pois é o modo de CRIAÇÃO
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-xl">Lista de Alunos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="divide-y divide-border">
              {students.map((student) => (
                <div
                  key={student.id}
                  onClick={() => navigate(`/students/${student.id}`)}
                  className="py-3 px-2 flex items-center font-medium text-foreground cursor-pointer transition-colors rounded-md hover:bg-accent"
                >
                  <User className="h-5 w-5 mr-3 text-muted-foreground" />
                  {student.name}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Você ainda não tem alunos cadastrados.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentsPage;

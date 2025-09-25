// /frontend/src/pages/StudentDetailPage.tsx
import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { StudentForm } from "../components/StudentForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { type Student as StudentType } from "../types"; // Importe o tipo centralizado

// O tipo de dados que a API retorna para esta página
/* eslint-disable @typescript-eslint/no-explicit-any */
type StudentDetails = StudentType & {
  addresses: any[]; // Simplificado, pode ser um tipo mais específico
};

function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchStudent = useCallback(() => {
    if (id) {
      api.get(`/students/${id}`).then((res) => setStudent(res.data));
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (!student) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto p-8">
      <Link to="/students">
        <Button variant="ghost" className="mb-6">
          &larr; Voltar para Alunos
        </Button>
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalhes de {student.name}</h1>
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogTrigger asChild>
            <Button>Editar Aluno</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Editar Aluno</DialogTitle>
              <DialogDescription>
                Altere as informações do aluno abaixo.
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              // 1. O NOME DA PROP FOI CORRIGIDO
              studentToEdit={student}
              // 2. O NOME DA FUNÇÃO DE CALLBACK FOI CORRIGIDO
              onFormSubmit={fetchStudent}
              closeDialog={() => setIsEditModalOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações Cadastradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Data de Nascimento:</strong>{" "}
            {new Date(student.birth_date).toLocaleDateString("pt-BR", {
              timeZone: "UTC",
            })}
          </p>
          <h4 className="font-semibold mt-4">Endereços:</h4>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            {student.addresses.map((addr: any) => (
              <li key={addr.id}>
                <strong>{addr.label}:</strong> {addr.logradouro}, {addr.numero}{" "}
                - {addr.bairro}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default StudentDetailPage;

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { type Student, type School } from "../types";

// Tipo para os dados do formulário (não tem ID)
type StudentFormData = {
  studentName: string;
  birthDate: string;
  schoolId: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

interface StudentFormProps {
  onStudentCreated: (newStudent: Student) => void;
  closeDialog: () => void;
}

export function StudentForm({
  onStudentCreated,
  closeDialog,
}: StudentFormProps) {
  const form = useForm<StudentFormData>();
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    api.get("/schools").then((response) => setSchools(response.data));
  }, []);

  async function onSubmit(data: StudentFormData) {
    try {
      const payload = {
        name: data.studentName,
        birth_date: data.birthDate,
        school_id: Number(data.schoolId),
        address: {
          logradouro: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
        },
      };
      // A resposta da API (response.data) terá o formato do tipo Student
      const response = await api.post("/students", payload);
      onStudentCreated(response.data); // Agora os tipos são compatíveis
      closeDialog();
    } catch (error) {
      console.error("Falha ao cadastrar aluno:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">Dados do Aluno</h3>
        <FormField
          name="studentName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Aluno</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="birthDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data de Nascimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="schoolId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Escola</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a escola" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={String(school.id)}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium pt-4">Endereço de Embarque</h3>
        <FormField
          name="logradouro"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="numero"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="bairro"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="cidade"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="estado"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado (UF)</FormLabel>
              <FormControl>
                <Input maxLength={2} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="cep"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">Salvar Aluno</Button>
        </div>
      </form>
    </Form>
  );
}

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type Student = { id: number; name: string };
type AddStudentFormData = {
  studentId: string;
  tripType: "ida_e_volta" | "apenas_ida" | "apenas_volta";
};
interface AddStudentToRouteFormProps {
  routeId: number;
  onStudentAdded: () => void;
  closeDialog: () => void;
}

export function AddStudentToRouteForm({
  routeId,
  onStudentAdded,
  closeDialog,
}: AddStudentToRouteFormProps) {
  const form = useForm<AddStudentFormData>();
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    api.get("/students/all").then((response) => setAllStudents(response.data));
  }, []);

  async function onSubmit(data: AddStudentFormData) {
    try {
      const payload = {
        student_id: Number(data.studentId),
        trip_type: data.tripType,
      };
      await api.post(`/routes/${routeId}/students`, payload);
      onStudentAdded();
      closeDialog();
    } catch (error) {
      console.error("Falha ao adicionar aluno à rota:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="studentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStudents.map((student) => (
                    <SelectItem key={student.id} value={String(student.id)}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="tripType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Viagem (Checklist)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de viagem" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ida_e_volta">Ida e Volta</SelectItem>
                  <SelectItem value="apenas_ida">Apenas Ida</SelectItem>
                  <SelectItem value="apenas_volta">Apenas Volta</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Adicionar à Rota</Button>
        </div>
      </form>
    </Form>
  );
}

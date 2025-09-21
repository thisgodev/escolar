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
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner";

// Tipos
type Student = { id: number; name: string };
type StudentAddress = { id: number; label: string; logradouro: string };
const weekdaysOptions = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
];

type AddStudentFormData = {
  studentId: string;
  pickupAddressId: string;
  dropoffAddressId: string;
  weekdays: string[];
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
  const form = useForm<AddStudentFormData>({
    defaultValues: { weekdays: [] },
  });
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentAddresses, setStudentAddresses] = useState<StudentAddress[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Observa a seleção do aluno para buscar seus endereços
  const selectedStudentId = form.watch("studentId");

  useEffect(() => {
    // Busca todos os alunos do tenant para o primeiro seletor
    api.get("/students/all").then((response) => setAllStudents(response.data));
  }, []);

  useEffect(() => {
    // Quando um aluno é selecionado, busca os endereços dele
    if (selectedStudentId) {
      api.get(`/students/${selectedStudentId}/addresses`).then((response) => {
        setStudentAddresses(response.data);
      });
    } else {
      setStudentAddresses([]); // Limpa a lista se nenhum aluno estiver selecionado
    }
  }, [selectedStudentId]);

  async function onSubmit(data: AddStudentFormData) {
    setIsLoading(true);
    const promise = api.post(`/routes/${routeId}/students`, {
      studentId: Number(data.studentId),
      pickupAddressId: Number(data.pickupAddressId),
      dropoffAddressId: Number(data.dropoffAddressId),
      weekdays: data.weekdays,
    });

    toast.promise(promise, {
      loading: "Adicionando aluno à rota...",
      success: () => {
        onStudentAdded();
        closeDialog();
        return "Aluno adicionado com sucesso!";
      },
      error: (err) =>
        err.response?.data?.message || "Falha ao adicionar aluno.",
    });

    promise.finally(() => setIsLoading(false));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Seletor de Aluno */}
        <FormField
          name="studentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selecione o Aluno</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStudents.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seletor de Endereço de Coleta (dinâmico) */}
        <FormField
          name="pickupAddressId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local de Coleta (Ida)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedStudentId || studentAddresses.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o endereço..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {studentAddresses.map((addr) => (
                    <SelectItem key={addr.id} value={String(addr.id)}>
                      {addr.label} ({addr.logradouro})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Seletor de Endereço de Entrega (dinâmico) */}
        <FormField
          name="dropoffAddressId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Local de Entrega (Volta)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={!selectedStudentId || studentAddresses.length === 0}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o endereço..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {studentAddresses.map((addr) => (
                    <SelectItem key={addr.id} value={String(addr.id)}>
                      {addr.label} ({addr.logradouro})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Checkboxes para Dias da Semana */}
        <FormField
          control={form.control}
          name="weekdays"
          render={() => (
            <FormItem>
              <FormLabel>Dias da Semana</FormLabel>
              <div className="flex flex-wrap gap-4 pt-2">
                {weekdaysOptions.map((day) => (
                  <FormField
                    key={day.id}
                    control={form.control}
                    name="weekdays"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={day.id}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(day.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, day.id])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== day.id
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {day.label}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adicionando..." : "Adicionar à Rota"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

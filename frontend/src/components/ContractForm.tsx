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
import { toast } from "sonner";
type User = { id: number; name: string };
type ContractFormData = {
  guardianId: string;
  studentId: string;
  installmentsCount: number;
  installmentValue: number;
  firstDueDate: string;
};
interface ContractFormProps {
  onContractCreated: () => void;
  closeDialog: () => void;
}
export function ContractForm({
  onContractCreated,
  closeDialog,
}: ContractFormProps) {
  const form = useForm<ContractFormData>({
    defaultValues: {
      guardianId: undefined, // Começa indefinido para o placeholder do Select funcionar
      studentId: undefined,
      installmentsCount: 12,
      installmentValue: 0.0,
      firstDueDate: new Date().toISOString().split("T")[0], // Padrão: hoje
    },
  });
  const [guardians, setGuardians] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    api.get("/users/guardians").then((res) => setGuardians(res.data));
    api.get("/students/all").then((res) => setStudents(res.data));
  }, []);
  async function onSubmit(data: ContractFormData) {
    setIsLoading(true);
    const payload = {
      guardian_id: Number(data.guardianId),
      student_id: Number(data.studentId),
      installments_count: Number(data.installmentsCount),
      installment_value: Number(data.installmentValue),
      first_due_date: data.firstDueDate,
      due_day: new Date(data.firstDueDate + "T00:00:00").getDate(),
    };
    const promise = api.post("/contracts", payload);

    toast.promise(promise, {
      loading: "Criando contrato...",
      success: () => {
        onContractCreated();
        closeDialog();
        return "Contrato criado com sucesso!";
      },
      error: (err) => err.response?.data?.message || "Falha ao criar contrato.",
    });

    promise.finally(() => setIsLoading(false));
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4"
      >
        <FormField
          name="guardianId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {guardians.map((g) => (
                    <SelectItem key={g.id} value={String(g.id)}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="studentId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aluno</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {students.map((s) => (
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
        <FormField
          name="installmentsCount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Parcelas</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="installmentValue"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor da Parcela (R$)</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="firstDueDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data do 1º Vencimento</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Salvando..." : "Salvar Contrato"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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

type StaffMember = { id: number; name: string; role: "driver" | "monitor" };
type AddStaffFormData = {
  userId: string;
  assignmentType: "main_driver" | "substitute_driver" | "monitor";
};
interface AddStaffToRouteFormProps {
  routeId: number;
  onStaffAdded: () => void;
  closeDialog: () => void;
}

export function AddStaffToRouteForm({
  routeId,
  onStaffAdded,
  closeDialog,
}: AddStaffToRouteFormProps) {
  const form = useForm<AddStaffFormData>();
  const [availableStaff, setAvailableStaff] = useState<StaffMember[]>([]);

  useEffect(() => {
    api
      .get("/users/staff")
      .then((response) => setAvailableStaff(response.data));
  }, []);

  async function onSubmit(data: AddStaffFormData) {
    try {
      const payload = {
        user_id: Number(data.userId),
        assignment_type: data.assignmentType,
      };
      await api.post(`/routes/${routeId}/staff`, payload);
      onStaffAdded();
      closeDialog();
    } catch (error) {
      console.error("Falha ao adicionar membro à rota:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="userId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Membro da Equipe</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um motorista ou monitor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableStaff.map((member) => (
                    <SelectItem key={member.id} value={String(member.id)}>
                      {member.name} (
                      {member.role === "driver" ? "Motorista" : "Monitor"})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="assignmentType"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Função na Rota</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a função" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="main_driver">Motorista Titular</SelectItem>
                  <SelectItem value="substitute_driver">
                    Motorista Substituto
                  </SelectItem>
                  <SelectItem value="monitor">Monitor(a)</SelectItem>
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

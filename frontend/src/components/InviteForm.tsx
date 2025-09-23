import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { toast } from "sonner";

type InviteFormData = {
  email: string;
  role: "guardian" | "driver" | "monitor";
};
interface InviteFormProps {
  onInviteSent: () => void;
  closeDialog: () => void;
}

export function InviteForm({ onInviteSent, closeDialog }: InviteFormProps) {
  const form = useForm<InviteFormData>();
  async function onSubmit(data: InviteFormData) {
    const promise = api.post("/invites", data);
    toast.promise(promise, {
      loading: "Enviando convite...",
      success: () => {
        onInviteSent();
        closeDialog();
        return "Convite enviado com sucesso!";
      },
      error: (err) => err.response?.data?.message || "Falha ao enviar convite.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do Convidado</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Papel do Usuário</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um papel" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="guardian">Responsável</SelectItem>
                  <SelectItem value="driver">Motorista</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Enviar Convite</Button>
        </div>
      </form>
    </Form>
  );
}

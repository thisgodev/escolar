import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "sonner";

interface ClientFormProps {
  onClientCreated: () => void;
  closeDialog: () => void;
}

export function ClientForm({ onClientCreated, closeDialog }: ClientFormProps) {
  const form = useForm();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async function onSubmit(data: any) {
    const payload = {
      clientData: {
        company_name: data.company_name,
        cpf_cnpj: data.cpf_cnpj,
        contact_email: data.admin_email,
        contact_phone: data.contact_phone,
      },
      adminData: {
        name: data.admin_name,
        email: data.admin_email,
        password: data.admin_password,
      },
    };
    const promise = api.post("/clients", payload);
    toast.promise(promise, {
      loading: "Criando cliente e administrador...",
      success: () => {
        onClientCreated();
        closeDialog();
        return "Cliente criado com sucesso!";
      },
      error: (err) => err.response?.data?.message || "Falha ao criar cliente.",
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-h-[70vh] overflow-y-auto p-1 pr-4"
      >
        <h3 className="text-lg font-medium">Dados da Empresa Cliente</h3>
        <FormField
          name="company_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="cpf_cnpj"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF/CNPJ</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="contact_phone"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone de Contato</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <h3 className="text-lg font-medium pt-4 border-t">
          Dados do Primeiro Administrador
        </h3>
        <FormField
          name="admin_name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Admin</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="admin_email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email do Admin</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="admin_password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha Provisória</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Salvar Cliente</Button>
        </div>
      </form>
    </Form>
  );
}

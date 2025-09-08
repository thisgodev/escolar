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

// Tipo que representa o objeto retornado pela API
type School = {
  id: number;
  name: string;
  cnpj: string | null;
};

// Tipo para os dados do formulário (não tem ID)
type SchoolFormData = {
  name: string;
  cnpj: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
};

// A prop onSchoolCreated AGORA ESPERA o tipo School
interface SchoolFormProps {
  onSchoolCreated: (newSchool: School) => void;
  closeDialog: () => void;
}

export function SchoolForm({ onSchoolCreated, closeDialog }: SchoolFormProps) {
  const form = useForm<SchoolFormData>({
    defaultValues: {
      name: "",
      cnpj: "",
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      cep: "",
    },
  });

  async function onSubmit(data: SchoolFormData) {
    try {
      const payload = {
        name: data.name,
        cnpj: data.cnpj || null, // Garante que CNPJ vazio seja enviado como nulo
        address: {
          logradouro: data.logradouro,
          numero: data.numero,
          bairro: data.bairro,
          cidade: data.cidade,
          estado: data.estado,
          cep: data.cep,
        },
      };
      // A resposta da API (response.data) terá o formato do tipo School
      const response = await api.post("/schools", payload);
      onSchoolCreated(response.data); // Agora os tipos são compatíveis
      closeDialog();
    } catch (error) {
      console.error("Falha ao cadastrar escola:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h3 className="text-lg font-medium">Dados da Escola</h3>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Escola</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="cnpj"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CNPJ (Opcional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <h3 className="text-lg font-medium pt-4">Endereço</h3>
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
          <Button type="submit">Salvar Escola</Button>
        </div>
      </form>
    </Form>
  );
}

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
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type School = { id: number; name: string };
type RouteFormData = { name: string; description: string; schoolId: string };
interface RouteFormProps {
  onRouteCreated: () => void;
  closeDialog: () => void;
}

export function RouteForm({ onRouteCreated, closeDialog }: RouteFormProps) {
  const form = useForm<RouteFormData>();
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    api.get("/schools").then((response) => setSchools(response.data));
  }, []);

  async function onSubmit(data: RouteFormData) {
    try {
      console.log(data);
      const payload = {
        name: data.name,
        description: data.description,
        school_id: Number(data.schoolId),
      };
      await api.post("/routes", payload);
      onRouteCreated();
      closeDialog();
    } catch (error) {
      console.error("Falha ao criar rota:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Rota</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rota Manhã - Bairro Alto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Detalhes sobre a rota..." {...field} />
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
              <FormLabel>Escola de Destino</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma escola" />
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
        <div className="flex justify-end pt-4">
          <Button type="submit">Salvar Rota</Button>
        </div>
      </form>
    </Form>
  );
}

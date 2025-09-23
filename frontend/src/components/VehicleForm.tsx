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
import { useEffect } from "react";

type VehicleFormData = {
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  status: "ativo" | "inativo" | "em_manutencao";
};
type Vehicle = {
  id: number;
  placa: string;
  modelo: string;
  ano: number;
  capacidade: number;
  status: "ativo" | "inativo" | "em_manutencao";
};

interface VehicleFormProps {
  onVehicleCreated: () => void;
  closeDialog: () => void;
  vehicleToEdit?: Vehicle | null;
}

export function VehicleForm({
  onVehicleCreated,
  closeDialog,
  vehicleToEdit,
}: VehicleFormProps) {
  const form = useForm<VehicleFormData>();

  useEffect(() => {
    if (vehicleToEdit) {
      form.reset(vehicleToEdit); // Preenche o form para edição
    }
  }, [vehicleToEdit, form]);

  async function onSubmit(data: VehicleFormData) {
    let promise;
    if (vehicleToEdit) {
      promise = api.patch(`/vehicles/${vehicleToEdit.id}`, data);
    } else {
      promise = api.post("/vehicles", data);
    }
    promise = api.post("/vehicles", {
      ...data,
      ano: Number(data.ano),
      capacidade: Number(data.capacidade),
    });

    toast.promise(promise, {
      loading: "Salvando veículo...",
      success: () => {
        onVehicleCreated();
        closeDialog();
        return "Veículo salvo com sucesso!";
      },
      error: (err) => err.response?.data?.message || "Falha ao salvar veículo.",
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          name="placa"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input placeholder="ABC-1234" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="modelo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Mercedes-Benz Sprinter" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="ano"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ano</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="capacidade"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="status"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                  <SelectItem value="em_manutencao">Em Manutenção</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Salvar Veículo</Button>
        </div>
      </form>
    </Form>
  );
}

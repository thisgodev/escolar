import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { DialogFooter } from "./ui/dialog";
import { type Student, type School } from "../types";
import { useViaCEP } from "@/hooks/useViaCEP";

// Tipo para os dados dos endereços no formulário
type AddressFormData = {
  id?: number; // O ID é opcional, existirá na edição
  label: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
};

// Tipo para os dados do formulário principal
type StudentFormData = {
  studentName: string;
  birthDate: string;
  schoolId: string;
  addresses: AddressFormData[];
};

// Interface de props atualizada para ser reutilizável
interface StudentFormProps {
  onFormSubmit: () => void; // Callback genérico para sucesso
  closeDialog: () => void;
  studentToEdit?: (Student & { addresses: AddressFormData[] }) | null; // Dados para edição
}

export function StudentForm({
  onFormSubmit,
  closeDialog,
  studentToEdit,
}: StudentFormProps) {
  const form = useForm<StudentFormData>({
    defaultValues: {
      studentName: "",
      birthDate: "",
      schoolId: undefined,
      addresses: [
        {
          label: "Casa Principal",
          cep: "",
          logradouro: "",
          numero: "",
          bairro: "",
          cidade: "",
          estado: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "addresses",
  });
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { fetchAddressByCEP, loading: cepLoading } = useViaCEP(
    form.setValue as any
  );
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Preenche o formulário quando em modo de edição
    if (studentToEdit) {
      form.reset({
        studentName: studentToEdit.name,
        birthDate: studentToEdit.birth_date
          ? new Date(studentToEdit.birth_date).toISOString().split("T")[0]
          : "",
        schoolId: String(studentToEdit.school_id) || undefined,
        addresses:
          studentToEdit.addresses.length > 0
            ? studentToEdit.addresses
            : [
                {
                  label: "",
                  cep: "",
                  logradouro: "",
                  numero: "",
                  bairro: "",
                  cidade: "",
                  estado: "",
                },
              ],
      });
    }
  }, [studentToEdit, form]);

  useEffect(() => {
    api.get("/schools").then((response) => {
      setSchools(response.data);
    });
  }, []);

  async function onSubmit(data: StudentFormData) {
    setIsLoading(true);

    // VERIFICAÇÃO DE SEGURANÇA: Garante que um schoolId foi selecionado
    if (!data.schoolId || isNaN(Number(data.schoolId))) {
      toast.error("Por favor, selecione uma escola válida.");
      setIsLoading(false);
      return;
    }

    const payload = {
      name: data.studentName,
      birth_date: data.birthDate,
      school_id: Number(data.schoolId),
      addresses: data.addresses,
    };

    let promise;

    if (studentToEdit) {
      promise = api.patch(`/students/${studentToEdit.id}`, payload);
    } else {
      promise = api.post("/students", payload);
    }

    toast.promise(promise, {
      loading: "Salvando dados do aluno...",
      success: () => {
        onFormSubmit(); // Chama o callback de sucesso (ex: fetchStudent)
        closeDialog();
        return "Aluno salvo com sucesso!";
      },
      error: (err) => err.response?.data?.message || "Falha ao salvar o aluno.",
    });
    promise.finally(() => setIsLoading(false));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[70vh] overflow-y-auto p-1 pr-4 space-y-4">
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
              </FormItem>
            )}
          />
          {/* Garanta que o seletor de escolas esteja assim: */}
          <FormField
            name="schoolId"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Escola</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      {/* Exibe o nome da escola selecionada ou o placeholder */}
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
              </FormItem>
            )}
          />
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="border p-4 rounded-lg mt-4 space-y-4 relative bg-muted/50"
            >
              <h4 className="font-semibold text-muted-foreground">
                Endereço {index + 1}
              </h4>
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 text-destructive hover:text-destructive"
                  onClick={() => remove(index)}
                >
                  Remover
                </Button>
              )}
              <FormField
                name={`addresses.${index}.label`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Identificação (Ex: Casa da Mãe)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.cep`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CEP</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          {...field}
                          maxLength={9}
                          onBlur={(e) =>
                            fetchAddressByCEP(e.target.value, index)
                          }
                        />
                      </FormControl>
                      <Button
                        type="button"
                        onClick={() =>
                          fetchAddressByCEP(
                            form.getValues(`addresses.${index}.cep`),
                            index
                          )
                        }
                        disabled={cepLoading}
                      >
                        {cepLoading ? "..." : "Buscar"}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.logradouro`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logradouro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.numero`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.bairro`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bairro</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.cidade`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                name={`addresses.${index}.estado`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado (UF)</FormLabel>
                    <FormControl>
                      <Input maxLength={2} {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              append({
                label: "",
                cep: "",
                logradouro: "",
                numero: "",
                bairro: "",
                cidade: "",
                estado: "",
              })
            }
          >
            Adicionar Outro Endereço
          </Button>
        </div>
        <DialogFooter className="pt-4">
          <Button type="button" variant="ghost" onClick={closeDialog}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? "Salvando..."
              : studentToEdit
              ? "Salvar Alterações"
              : "Salvar Aluno"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

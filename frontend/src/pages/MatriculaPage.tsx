import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import api from "../api/axios";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import { useViaCEP } from "../hooks/useViaCEP";

// --- Esquemas de Validação com Zod ---
const addressSchema = z.object({
  cep: z.string().min(8, "CEP é obrigatório."),
  logradouro: z.string().min(1, "Logradouro é obrigatório."),
  numero: z.string().min(1, "Número é obrigatório."),
  bairro: z.string().min(1, "Bairro é obrigatório."),
  cidade: z.string().min(1, "Cidade é obrigatória."),
  estado: z.string().length(2, "UF deve ter 2 caracteres."),
});

const studentSchema = z.object({
  name: z.string().min(3, "Nome do aluno é obrigatório."),
  school_id: z.string().min(1, { message: "Por favor, selecione uma escola." }),
  periodo: z
    .string()
    .min(1, "Por favor, selecione um período.")
    .refine((val) => ["manha", "tarde", "integral"].includes(val), {
      message: "Período inválido.",
    }),

  series_turma: z.string().optional(),
  start_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Data de início inválida.",
    }),
  birth_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Data de nascimento inválida.",
    }),
});

const matriculaSchema = z.object({
  responsibleData: z.object({
    name: z.string().min(3, "Nome do responsável é obrigatório."),
    email: z.string().email("Email inválido."),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
    cpf: z.string().refine(cpfValidator.isValid, "CPF inválido."),
    phone: z.string().min(10, "Telefone é obrigatório."),
  }),
  addressData: addressSchema,
  studentsData: z.array(studentSchema).min(1, "Adicione pelo menos um aluno."),
});

type MatriculaFormData = z.infer<typeof matriculaSchema>;
type School = { id: number; name: string };

function MatriculaPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();
  const [schools, setSchools] = useState<School[]>([]);

  const form = useForm<MatriculaFormData>({
    resolver: zodResolver(matriculaSchema),
    defaultValues: {
      responsibleData: {
        name: "",
        email: "",
        password: "",
        cpf: "",
        phone: "",
      },
      addressData: {
        cep: "",
        logradouro: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
      },
      studentsData: [{ name: "", school_id: undefined, periodo: undefined }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "studentsData",
  });

  const {
    fetchAddressByCEP,
    loading: cepLoading,
    error: cepError,
  } = useViaCEP(form.setValue);

  useEffect(() => {
    api
      .get(`/schools?tenantId=${tenantId}`)
      .then((res) => setSchools(res.data));
  }, [tenantId]);

  async function onSubmit(data: MatriculaFormData) {
    const promise = api.post(`/onboarding/matricula/${tenantId}`, data);
    toast.promise(promise, {
      loading: "Enviando sua matrícula...",
      success: () => {
        setTimeout(() => navigate("/login"), 3000);
        return "Matrícula realizada com sucesso! Você será redirecionado para a página de login.";
      },
      error: (err) => err.response?.data?.message || "Ocorreu um erro.",
    });
  }

  return (
    <div className="min-h-screen bg-muted/40 py-12 px-4">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Cadastro Aluno</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para concluir seu cadastro.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>1. Dados do Responsável</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <FormField
                  name="responsibleData.name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="responsibleData.cpf"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="responsibleData.email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="responsibleData.phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone (WhatsApp)</FormLabel>
                      <FormControl>
                        <Input type="tel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="responsibleData.password"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crie uma Senha</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>2. Endereço Principal</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <FormField
                  name="addressData.cep"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-3">
                      <FormLabel>CEP</FormLabel>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input
                            {...field}
                            onBlur={(e) =>
                              fetchAddressByCEP(e.target.value, "addressData.")
                            }
                          />
                        </FormControl>
                        <Button
                          type="button"
                          onClick={() =>
                            fetchAddressByCEP(
                              form.getValues("addressData.cep"),
                              "addressData."
                            )
                          }
                          disabled={cepLoading}
                        >
                          {cepLoading ? "..." : "Buscar"}
                        </Button>
                      </div>
                      {cepError && (
                        <p className="text-sm text-destructive">{cepError}</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="addressData.logradouro"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Logradouro</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="addressData.numero"
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
                  name="addressData.bairro"
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
                  name="addressData.cidade"
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
                  name="addressData.estado"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>3. Dados dos Alunos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border p-4 rounded-lg relative bg-background"
                  >
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        name={`studentsData.${index}.name`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Aluno</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`studentsData.${index}.school_id`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Escola</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {schools.map((s) => (
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
                        name={`studentsData.${index}.periodo`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Período</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="manha">Manhã</SelectItem>
                                <SelectItem value="tarde">Tarde</SelectItem>
                                <SelectItem value="integral">
                                  Integral
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`studentsData.${index}.birth_date`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`studentsData.${index}.series_turma`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Série/Turma</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        name={`studentsData.${index}.start_date`}
                        control={form.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Início do Transporte</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    append({
                      name: "",
                      school_id: "",
                      periodo: "manha",
                      birth_date: "",
                      series_turma: "",
                      start_date: "",
                    })
                  }
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Adicionar Outro Aluno
                </Button>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting
                  ? "Enviando ..."
                  : "Finalizar Cadastro"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default MatriculaPage;

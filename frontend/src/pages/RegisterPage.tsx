import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import api from "../api/axios";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Skeleton } from "../components/ui/skeleton";

// Tipos
type InviteData = {
  email: string;
  role: "guardian" | "driver" | "monitor";
};

export function RegisterPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const inviteToken = searchParams.get("token");

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm();

  useEffect(() => {
    if (!inviteToken) {
      setError(
        "Link de registro inválido ou ausente. Por favor, utilize o link recebido no convite."
      );
      setIsLoading(false);
      return;
    }

    // Valida o token de convite com o backend
    api
      .get(`/invites/${inviteToken}`)
      .then((res) => {
        setInviteData(res.data);
        form.setValue("email", res.data.email); // Pré-preenche o email e o torna não-editável
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Convite inválido, usado ou expirado."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [inviteToken, form]);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async function onSubmit(data: any) {
    const payload = { ...data, inviteToken, email: inviteData?.email };
    const promise = api.post("/auth/register", payload);

    toast.promise(promise, {
      loading: "Finalizando cadastro...",
      success: () => {
        setTimeout(() => navigate("/login"), 2000);
        return "Cadastro realizado com sucesso! Você será redirecionado para a tela de login.";
      },
      error: (err) =>
        err.response?.data?.message ||
        "Falha ao finalizar o cadastro. Verifique seus dados.",
    });
  }

  // --- Renderização Condicional ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Erro no Convite</h1>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Link to="/login" className="mt-6">
          <Button variant="outline">Voltar para o Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            Bus<span className="text-primary">Easy</span>
          </h1>
          <p className="text-muted-foreground">Finalize seu cadastro</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Bem-vindo(a)!</CardTitle>
            <CardDescription>
              {inviteData?.role === "guardian"
                ? "Preencha seus dados como responsável."
                : "Preencha seus dados como membro da equipe."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Campos Comuns */}
                <FormField
                  control={form.control}
                  name="name"
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
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" disabled {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
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
                  control={form.control}
                  name="cpf"
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

                {/* Campos Específicos do Responsável (Guardian) */}
                {inviteData?.role === "guardian" && (
                  <>
                    <FormField
                      control={form.control}
                      name="rg"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>RG (Opcional)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {/* Campos Específicos da Equipe (Driver/Monitor) */}
                {(inviteData?.role === "driver" ||
                  inviteData?.role === "monitor") && (
                  <>
                    <FormField
                      control={form.control}
                      name="document_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Documento (CNH, RG)</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Crie uma Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Finalizando..." : "Finalizar Cadastro"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

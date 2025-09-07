import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
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
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 1. Importe os ícones
import api from "@/api/axios";
export function RegisterPage() {
  const navigate = useNavigate();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // 2. Crie o estado de visibilidade

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async function onSubmit(data: any) {
    setIsLoading(true);
    setError(null);
    try {
      await api.post("/auth/register", data);
      navigate("/dashboard"); // Redireciona para o dashboard após o sucesso
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Erro ao entrar. Tente novamente."
      );
      console.error("Falha no login:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        {/* ... (cabeçalho da página) ... */}
        <Card>
          <CardHeader>
            <CardTitle>Criar Conta</CardTitle>
            <CardDescription>
              Preencha seus dados para acessar a plataforma.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Seu nome" {...field} />
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
                        <Input type="email" placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* 3. CAMPO DE SENHA MODIFICADO */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            {...field}
                            className="pr-10"
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                          aria-label={
                            showPassword ? "Ocultar senha" : "Mostrar senha"
                          }
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

                {error && (
                  <p className="text-sm font-medium text-destructive">
                    {error}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Criando conta..." : "Registrar"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Faça login
                  </Link>
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

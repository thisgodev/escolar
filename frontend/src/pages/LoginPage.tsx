import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios"; // Corrigido para caminho relativo
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
import { Eye, EyeOff } from "lucide-react";
import logo from "../assets/logo-sem-fundo.png";

export function LoginPage() {
  const navigate = useNavigate();
  const form = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  async function onSubmit(data: any) {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/login", data);

      // 1. CAPTURA O TOKEN DA RESPOSTA DA API
      const { token } = response.data;

      if (token) {
        // 2. SALVA O TOKEN NO LOCALSTORAGE
        localStorage.setItem("authToken", token);
        // 3. REDIRECIONA PARA O DASHBOARD
        navigate("/dashboard");
      } else {
        // Caso atípico: a API respondeu 200 OK mas não enviou o token.
        throw new Error("Resposta de login inválida do servidor.");
      }
    } catch (err: any) {
      // Tratamento de Erros Detalhado
      if (err.response) {
        // O servidor respondeu com um status de erro (4xx, 5xx)
        if (err.response.status === 401) {
          setError("Email ou senha incorretos.");
        } else {
          setError(
            err.response.data.message ||
              "Erro no servidor. Tente novamente mais tarde."
          );
        }
      } else if (err.request) {
        // A requisição foi feita mas não houve resposta (servidor offline, CORS)
        setError(
          "Não foi possível conectar ao servidor. Verifique sua conexão."
        );
      } else {
        // Erro na configuração da requisição
        setError("Ocorreu um erro inesperado. Tente novamente.");
      }
      console.error("Falha detalhada no login:", err); // Log completo para o suporte
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={logo} alt="BusEasy Logo" className="w-32 mx-auto mb-4" />
          <p className="text-muted-foreground">Bem-vindo(a) de volta!</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Acessar sua Conta</CardTitle>
            <CardDescription>
              Insira seu email e senha para continuar.
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Não tem uma conta?{" "}
                  <Link
                    to="/register"
                    className="font-semibold text-primary hover:underline"
                  >
                    Cadastre-se
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

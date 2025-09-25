import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ShieldCheck, MapPinned, Users } from "lucide-react";

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <img src="/logo-sem-fundo.png" alt="BusEasy Logo" className="h-10" />
        <div>
          <Link to="/login">
            <Button variant="ghost">Entrar</Button>
          </Link>
          <Link to="/register">
            <Button variant="secondary" className="ml-2">
              Cadastre-se
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-6 text-center py-24 md:py-32">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            A Próxima Geração em Gestão de Transporte Escolar
          </h2>
          <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground">
            Segurança, eficiência e tranquilidade para pais e administradores.
            Transforme sua operação com tecnologia de ponta.
          </p>
          <div className="mt-10">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-10 py-6 shadow-lg shadow-primary/20"
              >
                Conhecer o Sistema
              </Button>
            </Link>
          </div>
        </section>

        <section id="features" className="bg-card/50 py-24">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl md:text-4xl font-bold">
                Funcionalidades Essenciais
              </h3>
              <p className="mt-3 text-muted-foreground">
                Ferramentas pensadas para a sua operação.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-lg border border-border transition-transform hover:-translate-y-2">
                <MapPinned className="h-10 w-10 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">
                  Logística Inteligente
                </h4>
                <p className="text-muted-foreground">
                  Crie, gerencie e otimize rotas com facilidade. Tenha uma visão
                  clara de toda a sua operação.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg border border-border transition-transform hover:-translate-y-2">
                <ShieldCheck className="h-10 w-10 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">
                  Monitoramento em Tempo Real
                </h4>
                <p className="text-muted-foreground">
                  Acompanhe o embarque e desembarque de cada aluno com um
                  checklist diário e seguro.
                </p>
              </div>
              <div className="bg-card p-8 rounded-lg border border-border transition-transform hover:-translate-y-2">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h4 className="text-xl font-semibold mb-2">
                  Gestão Financeira Completa
                </h4>
                <p className="text-muted-foreground">
                  Automatize a geração de mensalidades, controle pagamentos e
                  simplifique a gestão de contratos.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-6 py-8 text-center text-muted-foreground border-t">
        <p>
          &copy; {new Date().getFullYear()} BusEasy. Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import {
  Home,
  Users,
  School,
  Route as RouteIcon,
  ListChecks,
  FileText,
} from "lucide-react"; // Renomeamos 'Route' para evitar conflito

export function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Define os links de navegação com seus ícones e papéis permitidos
  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: Home,
      roles: ["admin", "guardian", "driver", "monitor"],
    },
    { to: "/students", label: "Meus Alunos", icon: Users, roles: ["guardian"] },
    { to: "/schools", label: "Escolas", icon: School, roles: ["admin"] },
    { to: "/routes", label: "Rotas", icon: RouteIcon, roles: ["admin"] },
    { to: "/contracts", label: "Contratos", icon: FileText, roles: ["admin"] },
    {
      to: "/checklist",
      label: "Checklist",
      icon: ListChecks,
      roles: ["driver", "monitor"],
    },
  ];

  return (
    // Usa as cores do tema para o fundo e o texto
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar (Barra Lateral) */}
      <aside className="w-64 bg-card border-r p-4 flex-col hidden md:flex">
        <Link to="/dashboard" className="text-2xl font-bold mb-8 text-primary">
          BusEasy
        </Link>
        <nav className="flex flex-col space-y-2">
          {navLinks.map(
            (link) =>
              // Renderiza o link apenas se o papel do usuário estiver na lista de papéis permitidos
              user &&
              link.roles.includes(user.role) && (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <link.icon className="h-5 w-5 mr-3" />
                  <span>{link.label}</span>
                </Link>
              )
          )}
        </nav>
      </aside>

      {/* Conteúdo Principal (Direita) */}
      <div className="flex-1 flex flex-col">
        <header className="flex justify-end items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Olá, {user?.name || "Usuário"}
            </span>
            <ModeToggle />
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* O <Outlet /> é o marcador onde as páginas (DashboardPage, StudentsPage, etc.) serão renderizadas */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

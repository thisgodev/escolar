import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"; // Importe os novos componentes
import {
  Home,
  Users,
  School,
  Route as RouteIcon,
  ListChecks,
  FileText,
  Menu,
  Car,
  Building,
} from "lucide-react";
import logo from "../assets/logo-sem-fundo.png";
import { useState } from "react"; // Importe o useState

// Componente separado para a navegação para evitar repetição
// Adicionamos a prop 'onLinkClick' para fechar a gaveta
const NavigationLinks = ({ onLinkClick }: { onLinkClick?: () => void }) => {
  const { user } = useAuth();
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
    { to: "/vehicles", label: "Frota", icon: Car, roles: ["admin"] },
    {
      to: "/clients",
      label: "Clientes",
      icon: Building,
      roles: ["super_admin"],
    },
    {
      to: "/checklist",
      label: "Checklist",
      icon: ListChecks,
      roles: ["driver", "monitor"],
    },
  ];

  return (
    <nav className="flex flex-col space-y-2">
      {navLinks.map(
        (link) =>
          user &&
          link.roles.includes(user.role) && (
            <Link
              key={link.to}
              to={link.to}
              onClick={onLinkClick} // Chama a função ao clicar no link
              className="flex items-center p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <link.icon className="h-5 w-5 mr-3" />
              <span>{link.label}</span>
            </Link>
          )
      )}
    </nav>
  );
};

export function MainLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSheetOpen, setIsSheetOpen] = useState(false); // Estado para controlar a gaveta

  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Limpa a autenticação
    navigate("/login"); // Usa a função para redirecionar o usuário
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Sidebar para Desktop */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r bg-background sm:flex">
        <div className="flex h-full max-h-screen flex-col gap-2 p-4">
          <Link to="/dashboard" className="mb-4">
            <img src={logo} alt="BusEasy Logo" className="w-32" />
          </Link>
          <NavigationLinks />
        </div>
      </aside>

      <div className="flex flex-col sm:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          {/* Menu Gaveta para Mobile */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              {/* Adiciona o Header, Title e Description para acessibilidade */}
              <SheetHeader className="text-left mb-8">
                <SheetTitle>
                  <Link to="/dashboard" onClick={() => setIsSheetOpen(false)}>
                    <img src={logo} alt="BusEasy Logo" className="w-32" />
                  </Link>
                </SheetTitle>
                <SheetDescription className="colors-muted-foreground mt-2">
                  BusEasy, facilitando o transporte escolar.
                </SheetDescription>
              </SheetHeader>
              <NavigationLinks onLinkClick={() => setIsSheetOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="relative ml-auto flex-1 md:grow-0" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden md:inline-block">
              Olá, {user?.name || "Usuário"}
            </span>
            <ModeToggle />
            <Button onClick={handleLogout} variant="destructive" size="sm">
              Sair
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

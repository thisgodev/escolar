import { BrowserRouter, Routes, Route } from "react-router-dom";

// Lógica de Roteamento
import { ProtectedRoute } from "./ProtectedRoute";

// Layouts
import { MainLayout } from "../components/MainLayout";

// Páginas Públicas
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";

// Páginas Protegidas
import { DashboardPage } from "../pages/DashboardPage";
import { StudentsPage } from "../pages/StudentsPage";
import { SchoolsPage } from "../pages/SchoolsPage";
import { RoutesPage } from "../pages/RoutesPage";
import { RouteDetailPage } from "../pages/RouteDetailPage";
import { ContractsPage } from "../pages/ContractsPage";
import { ContractDetailPage } from "../pages/ContractDetailPage";
import { ChecklistPage } from "../pages/ChecklistPage";
import { VehiclesPage } from "@/pages/VehiclesPage";
import { ClientsPage } from "@/pages/ClientsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rotas Públicas --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Rotas Protegidas com o Layout Principal --- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/students" element={<StudentsPage />} />
            <Route path="/schools" element={<SchoolsPage />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/:id" element={<RouteDetailPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
            <Route path="/contracts/:id" element={<ContractDetailPage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/clients" element={<ClientsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react"; // 1. IMPORTE 'lazy' E 'Suspense'

// --- Lógica de Roteamento ---
import { ProtectedRoute } from "./ProtectedRoute";

// --- Layouts ---
import { MainLayout } from "../components/MainLayout";
import { Skeleton } from "../components/ui/skeleton"; // Para um fallback de loading

// 2. IMPORTE AS PÁGINAS USANDO 'lazy()'
const HomePage = lazy(() => import("@/pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const StudentsPage = lazy(() => import("../pages/StudentsPage"));
const SchoolsPage = lazy(() => import("../pages/SchoolsPage"));
const RoutesPage = lazy(() => import("../pages/RoutesPage"));
const RouteDetailPage = lazy(() => import("../pages/RouteDetailPage"));
const ContractsPage = lazy(() => import("../pages/ContractsPage"));
const ContractDetailPage = lazy(() => import("../pages/ContractDetailPage"));
const ChecklistPage = lazy(() => import("../pages/ChecklistPage"));
const VehiclesPage = lazy(() => import("../pages/VehiclesPage"));
const ClientsPage = lazy(() => import("../pages/ClientsPage"));
const StudentDetailPage = lazy(() => import("../pages/StudentDetailPage"));

// Componente simples para o fallback de loading
const PageLoader = () => (
  <div className="p-8">
    <Skeleton className="h-64 w-full" />
  </div>
);

export function AppRouter() {
  return (
    <BrowserRouter>
      {/* 3. ENVOLVA SUAS ROTAS COM <Suspense /> */}
      <Suspense fallback={<PageLoader />}>
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
              <Route path="/students/:id" element={<StudentDetailPage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

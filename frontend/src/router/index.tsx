// /frontend/src/router/index.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importe seus componentes de página aqui à medida que os cria
// Ex: import { HomePage } from '../pages/HomePage';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Adicione suas rotas aqui */}
        {/* <Route path="/" element={<HomePage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

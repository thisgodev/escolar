// /frontend/src/hooks/useAuth.ts
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  role: "admin" | "guardian" | "driver" | "monitor";
  iat: number;
  exp: number;
};

export const useAuth = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return { user: null, isAuthenticated: false };
  }

  try {
    // Adicione um nome para o usuário no seu token JWT no backend para exibi-lo
    const decodedUser = jwtDecode<DecodedToken & { name: string }>(token);
    return { user: decodedUser, isAuthenticated: true };
  } catch (error) {
    localStorage.removeItem("authToken");
    return { user: null, isAuthenticated: false };
  }
};

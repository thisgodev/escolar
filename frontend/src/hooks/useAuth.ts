import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  id: number;
  name: string;
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
    const decodedUser = jwtDecode<DecodedToken>(token);
    // Verifica se o token expirou
    if (decodedUser.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return { user: null, isAuthenticated: false };
    }
    return { user: decodedUser, isAuthenticated: true };
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    localStorage.removeItem("authToken");
    return { user: null, isAuthenticated: false };
  }
};

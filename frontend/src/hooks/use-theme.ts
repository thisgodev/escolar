import { createContext, useContext } from "react";

export type Theme = "dark" | "light" | "system";

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => {
    console.error("A função setTheme foi chamada fora de um ThemeProvider.");
  },
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  return context;
};

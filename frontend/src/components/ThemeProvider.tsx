import { useEffect, useState } from "react";

// Importa o Contexto e os tipos do nosso hook customizado
import {
  ThemeProviderContext,
  type Theme,
  type ThemeProviderState,
} from "../hooks/use-theme";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "buseasy-ui-theme", // Chave única para o localStorage
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    // Ao iniciar, tenta ler o tema do localStorage. Se não encontrar, usa o padrão.
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;

    // Limpa as classes de tema anteriores
    root.classList.remove("light", "dark");

    // Aplica a classe correta baseada no tema
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  // O valor que será compartilhado com todos os componentes filhos
  const value: ThemeProviderState = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Salva a nova escolha no localStorage e atualiza o estado
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

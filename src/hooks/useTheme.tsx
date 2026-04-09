import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  animalMode: boolean;
  toggleTheme: () => void;
  toggleAnimalMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem("tb-ai-theme") as Theme) || "dark";
  });
  const [animalMode, setAnimalMode] = useState(() => {
    return localStorage.getItem("tb-ai-animal-mode") === "true";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
    localStorage.setItem("tb-ai-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("tb-ai-animal-mode", String(animalMode));
  }, [animalMode]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  const toggleAnimalMode = () => setAnimalMode((a) => !a);

  return (
    <ThemeContext.Provider value={{ theme, animalMode, toggleTheme, toggleAnimalMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

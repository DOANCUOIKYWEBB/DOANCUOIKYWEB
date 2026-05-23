import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === "light" ? "dark" : "light";
      localStorage.setItem("artfolio-theme", newTheme);
      
      if (typeof window !== "undefined") {
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      
      return { theme: newTheme };
    });
  },
  initializeTheme: () => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("artfolio-theme") as Theme | null;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      
      const themeToSet = storedTheme || (prefersDark ? "dark" : "light");
      
      if (themeToSet === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      
      set({ theme: themeToSet });
    }
  },
}));

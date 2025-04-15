import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context with a default value to avoid undefined
export const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only use window/localStorage in browser environment
    if (typeof window !== "undefined") {
      // Check for saved theme in localStorage
      const savedTheme = localStorage.getItem("theme") as Theme | null;
      
      // If saved preference exists, use it
      if (savedTheme === "dark" || savedTheme === "light") {
        return savedTheme;
      }
      
      // Otherwise check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return "dark";
      }
    }
    
    // Default to light theme
    return "light";
  });

  useEffect(() => {
    // Only run in client-side environment
    if (typeof window === "undefined") return;

    // Update the document class when theme changes
    const root = window.document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      document.body.style.colorScheme = "dark";
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
      document.body.style.colorScheme = "light";
    }
    
    // Save to localStorage
    localStorage.setItem("theme", theme);
    
    // Log theme change for debugging
    console.log("Theme changed to:", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

import { Button } from "./button";
import { useTheme } from "../ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full transition-all duration-300 hover:shadow-md hover:shadow-accent/20 hover:scale-105 active:scale-95 bg-muted border-accent/20"
      aria-label="Toggle theme"
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === "light" ? (
        <Sun className="h-5 w-5 text-accent animate-spin-slow" />
      ) : (
        <Moon className="h-5 w-5 text-accent animate-pulse-slow" />
      )}
    </Button>
  );
}

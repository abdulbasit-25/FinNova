import { useEffect } from "react";
import { AccentColor } from "@/types/expense-tracker";

export function useTheme(
  theme: "light" | "dark" | "system",
  accentColor: AccentColor,
) {
  useEffect(() => {
    const root = document.documentElement;

    // Theme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const isDark = theme === "dark" || (theme === "system" && prefersDark);
    root.classList.toggle("dark", isDark);

    // Accent
    root.classList.remove("accent-green", "accent-purple");
    if (accentColor === "green") root.classList.add("accent-green");
    if (accentColor === "purple") root.classList.add("accent-purple");
  }, [theme, accentColor]);
}

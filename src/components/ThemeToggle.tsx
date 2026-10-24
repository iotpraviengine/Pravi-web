"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export const THEME_KEY = "skv-theme";
type Theme = "dark" | "light";

/** Runs in <head> before first paint, so a saved light choice never flashes dark. Dark is the default. */
export const themeScript = `try{if(localStorage.getItem("${THEME_KEY}")==="light"){document.documentElement.dataset.theme="light";document.querySelector('meta[name="theme-color"]')?.setAttribute("content","#ffffff")}}catch(e){}`;

/** Sun / moon switch in the bar: flips the whole site between dark and light and remembers the choice. */
export function ThemeToggle() {
  // null until mounted: the server cannot know the saved choice
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
  }, []);

  const flip = () => {
    const next: Theme = theme === "light" ? "dark" : "light";
    const root = document.documentElement;
    if (next === "light") root.dataset.theme = "light";
    else delete root.dataset.theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#ffffff" : "#000000");
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
    setTheme(next);
  };

  const light = theme === "light";
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={flip}
      aria-label={light ? "Chuyển sang nền tối" : "Chuyển sang nền sáng"}
      title={light ? "Nền tối" : "Nền sáng"}
    >
      {/* both icons are drawn; CSS shows the one for the theme in effect, so it is right before hydration too */}
      <Sun size={18} aria-hidden="true" className="theme-icon-sun" />
      <Moon size={18} aria-hidden="true" className="theme-icon-moon" />
    </button>
  );
}

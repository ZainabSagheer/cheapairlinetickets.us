"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9 rounded-xl" aria-hidden />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-xl glass border border-[#2563EB]/30 flex items-center justify-center text-[#2563EB] hover:bg-[#2563EB]/20 hover:scale-110 transition-all duration-200"
    >
      {isDark
        ? <Sun  className="w-[18px] h-[18px]" />
        : <Moon className="w-[18px] h-[18px]" />
      }
    </button>
  );
}

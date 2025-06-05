"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const ThemeButton = () => {
  const [isClient, setIsClient] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <Button
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className={`cursor-pointer ${
          theme === "dark" ? "bg-black hover:bg-slate-300" : ""
        }`}
      >
        {theme === "light" ? (
          <Sun className="text-black" />
        ) : (
          <Moon className="text-white" />
        )}
      </Button>
    )
  );
};

export default ThemeButton;

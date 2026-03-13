"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { generatePalette, applyPalette, DEFAULT_PRIMARY_COLOR } from "@/lib/theme/colors";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    primaryColor: string;
    setPrimaryColor: (color: string) => void;
    actualTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("system");
    const [primaryColor, setPrimaryColor] = useState<string>(DEFAULT_PRIMARY_COLOR);
    const [actualTheme, setActualTheme] = useState<"light" | "dark">("light");

    // Initialize theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme;
        const savedPrimaryColor = localStorage.getItem("primaryColor");

        if (savedTheme) {
            setTheme(savedTheme);
        }

        if (savedPrimaryColor) {
            setPrimaryColor(savedPrimaryColor);
        }
    }, []);

    // Apply theme changes
    useEffect(() => {
        const root = document.documentElement;
        let effectiveTheme: "light" | "dark" = "light";
        let cleanup: (() => void) | undefined;

        if (theme === "system") {
            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            effectiveTheme = mediaQuery.matches ? "dark" : "light";

            const handleChange = (e: MediaQueryListEvent) => {
                const newTheme = e.matches ? "dark" : "light";
                setActualTheme(newTheme);
                root.classList.toggle("dark", newTheme === "dark");

                // Regenerate palette
                const palette = generatePalette(primaryColor, newTheme === "dark");
                applyPalette(palette);
            };

            mediaQuery.addEventListener("change", handleChange);
            cleanup = () => mediaQuery.removeEventListener("change", handleChange);
        } else {
            effectiveTheme = theme;
        }

        setActualTheme(effectiveTheme);
        root.classList.toggle("dark", effectiveTheme === "dark");

        // Generate and apply color palette
        const palette = generatePalette(primaryColor, effectiveTheme === "dark");
        applyPalette(palette);

        // Save to localStorage
        localStorage.setItem("theme", theme);

        return cleanup;
    }, [theme, primaryColor]);

    // Apply primary color changes
    useEffect(() => {
        const palette = generatePalette(primaryColor, actualTheme === "dark");
        applyPalette(palette);
        localStorage.setItem("primaryColor", primaryColor);
    }, [primaryColor, actualTheme]);

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
    };

    const handleSetPrimaryColor = (color: string) => {
        setPrimaryColor(color);
    };

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme: handleSetTheme,
                primaryColor,
                setPrimaryColor: handleSetPrimaryColor,
                actualTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

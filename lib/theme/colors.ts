/**
 * Material Design 3 Color Palette Generator
 * Generates a complete tonal palette from a primary color
 */


/**
 * Convert hex color to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        return { h: 0, s: 0, l: 0 };
    }

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    let l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/**
 * Convert HSL to hex color
 */
function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0;
    let g = 0;
    let b = 0;

    if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
    } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
    } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
    } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
    } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
    } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
    }

    const toHex = (n: number) => {
        const hex = Math.round((n + m) * 255).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate Material Design 3 color palette from a primary color
 */
export const DEFAULT_PRIMARY_COLOR = "#6750a4";

export interface ColorPalette {
    // Shadcn Variables
    "--background": string;
    "--foreground": string;
    "--card": string;
    "--card-foreground": string;
    "--popover": string;
    "--popover-foreground": string;
    "--primary": string;
    "--primary-foreground": string;
    "--secondary": string;
    "--secondary-foreground": string;
    "--muted": string;
    "--muted-foreground": string;
    "--accent": string;
    "--accent-foreground": string;
    "--destructive": string;
    "--destructive-foreground": string;
    "--border": string;
    "--input": string;
    "--ring": string;
    "--radius": string;

    // MD3 Compat (optional, keeping for existing components)
    "--md-sys-color-primary": string;
    "--md-sys-color-on-primary": string;
    "--md-sys-color-surface": string;
    "--md-sys-color-on-surface": string;
    "--md-sys-color-surface-variant": string;
    "--md-sys-color-on-surface-variant": string;
    "--md-sys-color-outline": string;
    "--md-sys-color-outline-variant": string;
}

// Helper to get HSL string for shadcn (e.g. "240 10% 3.9%")
function hexToHslString(hex: string): string {
    const { h, s, l } = hexToHSL(hex);
    return `${h} ${s}% ${l}%`;
}

export function generatePalette(primaryColor: string, isDark: boolean = false): ColorPalette {
    // Neutral colors for background/surface (Zinc-like)
    const neutral = {
        50: "#fafafa",
        100: "#f4f4f5",
        200: "#e4e4e7",
        300: "#d4d4d8",
        400: "#a1a1aa",
        500: "#71717a",
        600: "#52525b",
        700: "#3f3f46",
        800: "#27272a",
        900: "#18181b",
        950: "#09090b",
    };

    // Use the user's exact primary color, ensuring they get what they clicked
    const primaryHex = primaryColor;

    // Calculate true relative luminance to determine contrasting text (YIQ formula)
    const hex = primaryColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const onPrimaryHex = yiq >= 128 ? "#000000" : "#ffffff";

    if (isDark) {
        return {
            "--background": hexToHslString(neutral[950]),
            "--foreground": hexToHslString(neutral[50]),
            "--card": hexToHslString(neutral[950]),
            "--card-foreground": hexToHslString(neutral[50]),
            "--popover": hexToHslString(neutral[950]),
            "--popover-foreground": hexToHslString(neutral[50]),
            "--primary": hexToHslString(primaryHex),
            "--primary-foreground": hexToHslString(onPrimaryHex),
            "--secondary": hexToHslString(neutral[800]),
            "--secondary-foreground": hexToHslString(neutral[50]),
            "--muted": hexToHslString(neutral[800]),
            "--muted-foreground": hexToHslString(neutral[400]),
            "--accent": hexToHslString(neutral[800]),
            "--accent-foreground": hexToHslString(neutral[50]),
            "--destructive": "0 62.8% 30.6%", // #7f1d1d
            "--destructive-foreground": "0 0% 98%", // #fef2f2
            "--border": hexToHslString(neutral[800]),
            "--input": hexToHslString(neutral[800]),
            "--ring": hexToHslString(primaryHex),
            "--radius": "0.75rem",

            // MD3 Compat (Keep as Hex)
            "--md-sys-color-primary": primaryHex,
            "--md-sys-color-on-primary": onPrimaryHex,
            "--md-sys-color-surface": neutral[900],
            "--md-sys-color-on-surface": neutral[50],
            "--md-sys-color-surface-variant": neutral[800],
            "--md-sys-color-on-surface-variant": neutral[400],
            "--md-sys-color-outline": neutral[600],
            "--md-sys-color-outline-variant": neutral[700],
        };
    }

    // Light Mode
    return {
        "--background": "0 0% 100%", // #ffffff
        "--foreground": hexToHslString(neutral[950]),
        "--card": "0 0% 100%",
        "--card-foreground": hexToHslString(neutral[950]),
        "--popover": "0 0% 100%",
        "--popover-foreground": hexToHslString(neutral[950]),
        "--primary": hexToHslString(primaryHex),
        "--primary-foreground": hexToHslString(onPrimaryHex),
        "--secondary": hexToHslString(neutral[100]),
        "--secondary-foreground": hexToHslString(neutral[900]),
        "--muted": hexToHslString(neutral[100]),
        "--muted-foreground": hexToHslString(neutral[500]),
        "--accent": hexToHslString(neutral[100]),
        "--accent-foreground": hexToHslString(neutral[900]),
        "--destructive": "0 84.2% 60.2%", // #ef4444
        "--destructive-foreground": "0 0% 98%",
        "--border": hexToHslString(neutral[200]),
        "--input": hexToHslString(neutral[200]),
        "--ring": hexToHslString(primaryHex),
        "--radius": "0.75rem",

        // MD3 Compat (Keep as Hex)
        "--md-sys-color-primary": primaryHex,
        "--md-sys-color-on-primary": onPrimaryHex,
        "--md-sys-color-surface": "#ffffff",
        "--md-sys-color-on-surface": neutral[950],
        "--md-sys-color-surface-variant": neutral[100],
        "--md-sys-color-on-surface-variant": neutral[600],
        "--md-sys-color-outline": neutral[300],
        "--md-sys-color-outline-variant": neutral[200],
    };
}

export function applyPalette(palette: ColorPalette): void {
    const root = document.documentElement;
    Object.entries(palette).forEach(([key, value]) => {
        root.style.setProperty(key, value);
    });
}

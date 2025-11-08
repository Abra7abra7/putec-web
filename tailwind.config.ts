import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Custom breakpoints - mobile-first approach
      screens: {
        desktop: "768px",
      },
      fontFamily: {
        heading: ["var(--font-poppins)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      colors: {
        // Base colors
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        "foreground-light": "var(--color-foreground-light)",
        "foreground-muted": "var(--color-foreground-muted)",
        "foreground-subtle": "var(--color-foreground-subtle)",
        
        // Accent colors (gold theme)
        accent: "var(--color-accent)",
        "accent-dark": "var(--color-accent-dark)",
        "accent-light": "var(--color-accent-light)",
        "accent-subtle": "var(--color-accent-subtle)",
        
        // Gray scale
        gray: {
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
        
        // shadcn/ui compatibility colors
        border: "var(--color-gray-200)",
        input: "var(--color-gray-200)",
        ring: "var(--color-accent)",
        
        // Legacy color mappings (for backward compatibility)
        "wine-red": "var(--color-wine-red)",
        "wine-dark": "var(--color-wine-dark)",
        "wine-light": "var(--color-wine-light)",
        primary: "var(--color-primary)",
        "primary-dark": "var(--color-primary-dark)",
        "primary-light": "var(--color-primary-light)",
        "accent-brown": "var(--color-accent-brown)",
        "accent-gold": "var(--color-accent-gold)",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
    },
  },
  plugins: [],
};

export default config;

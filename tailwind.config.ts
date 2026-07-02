import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Streambe (Manual de marca v1.0)
        tech: "#0253E8", // azul primario / CTA
        soft: "#2FB1FE", // celeste
        action: "#B1EDFF", // celeste claro
        digital: "#10192B", // azul marino oscuro
        ink: "#202020", // texto principal
        paper: "#FAFAFA", // fondo claro
        line: "#E8E8E3", // bordes / divisores
        success: "#29C927",
        danger: "#EB2D2D",
      },
      fontFamily: {
        display: ["var(--font-familjen)", "Helvetica", "Arial", "sans-serif"],
        sans: ["var(--font-inter)", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

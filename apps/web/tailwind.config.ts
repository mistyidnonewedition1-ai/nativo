import type { Config } from "tailwindcss";

// Les couleurs viennent de variables CSS (globals.css) : un seul endroit pour les thèmes.
const token = (n: string) => `rgb(var(--${n}) / <alpha-value>)`;
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: token("bg"), surface: token("surface"), ink: token("ink"), muted: token("muted"),
        line: token("line"), accent: token("accent"), "accent-ink": token("accent-ink"), sun: token("sun"),
        danger: token("danger"),
      },
      fontFamily: { sans: ["var(--font-sans)", "system-ui", "sans-serif"] },
    },
  },
} satisfies Config;

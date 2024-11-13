import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryGreen: '#4CAF50',
        secondaryYellow: '#F5C200',
        neutralDark: '#2E2E2E',
        neutralLight: '#F2F2F2',
        accentBlue: '#4A90E2',
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require("rippleui")],
};
export default config;

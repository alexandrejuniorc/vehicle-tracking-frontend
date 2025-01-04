import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        default: "#242526",
        main: "#FFCD00",
        error: "#F35759",
        success: "#366912",
      },
      textColor: {
        primary: "#242526",
        contrast: "#FFFFFF",
      },
    },
  },
  plugins: [],
} satisfies Config;

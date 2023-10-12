import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ["me-icon"]: "#a5f3fcff",
        ["assistant-icon"]: "#f19a0bff",
        assistant: "#e5e7ebff",
        cancel: "#ee4343",
        success: "#10b932",
      },
    },
  },
  plugins: [],
};
export default config;

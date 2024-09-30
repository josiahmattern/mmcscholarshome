/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        darkcmyk: {
          primary: "#00adee",
          secondary: "#efbb34",
          accent: "#d81a8b",
          neutral: "#3d4451",
          "base-100": "#353B47",
          "base-content": "#E2E5EB",
        },
        cmyk: {
          primary: "#00adee",
          secondary: "#efbb34",
          accent: "#d81a8b",
          neutral: "#3d4451",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};

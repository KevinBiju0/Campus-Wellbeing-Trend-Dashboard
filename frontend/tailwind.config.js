/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dusk: {
          50: "#eef7f8", 100: "#d9eaed", 200: "#b8d2d8", 300: "#8db5be", 400: "#5f98a5",
          500: "#3d7f8e", 600: "#2e6878", 700: "#245465", 800: "#183b4d", 900: "#102b3d", 950: "#07101e"
        },
        sand: { 50: "#f7f9f7", 100: "#eaf0ed", 200: "#d8e4df", 300: "#bdcec7" },
        clover: { 400: "#74e0d2", 500: "#42d6c5", 600: "#27b9aa" },
        amber: { 400: "#f8d77e", 500: "#f4c95d", 600: "#dcae38" },
        coral: { 400: "#f49b9b", 500: "#ef7d7d", 600: "#d85f69" },
      },
      fontFamily: { display: ["Inter", "sans-serif"], body: ["Inter", "sans-serif"] },
      boxShadow: {
        glass: "0 10px 36px rgba(0,0,0,.18)",
        "glass-lg": "0 24px 70px rgba(0,0,0,.28)",
      },
    },
  },
  plugins: [],
};

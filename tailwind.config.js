/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ THIS is what you need
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo color
        secondary: "#9333EA", // Purple accent
        background: "#F9FAFB", // Light gray background
        dark: "#111827", // Dark mode background
        muted: "#6B7280", // Muted text
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 12px rgba(0, 0, 0, 0.1)", // Softer card shadow
      },
    },
  },
  plugins: [],
};

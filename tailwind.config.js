/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f1fe',
          100: '#e0e3fd',
          200: '#c2c7fb',
          300: '#a4acf9',
          400: '#8690f7',
          500: '#4F46E5', // your existing primary
          600: '#4738e4',
          700: '#392fd9',
          800: '#2f27b3',
          900: '#252092',
        },
        secondary: {
          50: '#f7f1fe',
          100: '#efe2fd',
          200: '#dfc5fb',
          300: '#cfa8f9',
          400: '#bf8bf7',
          500: '#9333EA', // your existing secondary
          600: '#8929e4',
          700: '#7322d9',
          800: '#5f1cb3',
          900: '#4d1792',
        },
        background: {
          light: '#F9FAFB',
          dark: '#111827',
        },
        muted: {
          light: '#6B7280',
          dark: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 12px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 16px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
};

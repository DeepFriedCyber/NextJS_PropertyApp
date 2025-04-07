/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f1f9',
          100: '#cce3f3',
          200: '#99c7e6',
          300: '#66abd9',
          400: '#338fcc',
          500: '#1a5a8c', // Dark blue primary
          600: '#154873',
          700: '#10365a',
          800: '#0a2440',
          900: '#051227',
        },
        gold: {
          50: '#f9f5e6',
          100: '#f3ebcc',
          200: '#e6d799',
          300: '#d9c366',
          400: '#ccaf33',
          500: '#8c6a1a', // Dark gold primary
          600: '#735515',
          700: '#5a4010',
          800: '#402c0a',
          900: '#271805',
        },
        dark: {
          50: '#f2f2f2',
          100: '#e6e6e6',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#1a1a2e', // Dark background
          600: '#151525',
          700: '#10101c',
          800: '#0a0a12',
          900: '#050509',
        },
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
      },
      boxShadow: {
        'inner-lg': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'floatDelayed 6s ease-in-out infinite 2s',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        floatDelayed: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1F3A',
          800: '#102A4E',
          700: '#163663',
          600: '#1E467C'
        },
        cobalt: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          500: '#2563EB',
          600: '#1D63E9',
          700: '#174FC0',
          800: '#133E96'
        },
        page: '#F3F5F9'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 16px -2px rgba(11, 31, 58, 0.05), 0 2px 6px -1px rgba(11, 31, 58, 0.03)'
      }
    },
  },
  plugins: [],
}

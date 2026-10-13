/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saas: {
          dark: '#1F1E29',
          canvas: '#FFFFFF',
          text: '#22212A',
          secondary: '#777681',
          muted: '#A2A0AA',
          border: '#ECEBF0',
          borderDark: '#DDDCE3',
          surface: '#F8F7FA',
          surfaceHover: '#F2F1F6',
          primary: '#24232E',
          primaryHover: '#353342',
          lavender: '#F0EAF8',
          lavenderBorder: '#E5DDF3',
          warmPink: '#FBF0EA',
          purple: '#A58BFA',
          green: '#2D9C70',
          amber: '#D89B30',
          teal: '#008767',
          tealBg: '#E6F7F2',
          tealBorder: '#A7E8D6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'saas-sm': '0 1px 2px rgba(15, 14, 23, 0.04)',
        'saas': '0 4px 16px rgba(15, 14, 23, 0.04), 0 1px 3px rgba(15, 14, 23, 0.03)',
        'saas-lg': '0 12px 36px rgba(15, 14, 23, 0.08), 0 2px 6px rgba(15, 14, 23, 0.03)',
        'saas-product': '0 20px 48px rgba(31, 30, 41, 0.08), 0 4px 12px rgba(31, 30, 41, 0.04)',
      },
      borderRadius: {
        'canvas': '14px',
        'card': '16px',
        'pill': '9999px',
      }
    },
  },
  plugins: [],
}

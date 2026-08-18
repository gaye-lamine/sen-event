/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        dark: {
          900: '#07090E',
          850: '#0B0E17',
          800: '#0F121C',
          750: '#151926',
          700: '#1C2234',
          600: '#2A334C',
        },
        cream: {
          50: '#FDFBF7',
          100: '#FAF8F5',
          200: '#F5F2EB',
          300: '#ECE7DC',
        },
        accent: {
          gold: '#FBBF24',
          yellow: '#FDE047',
          orange: '#F97316',
          purple: '#8B5CF6',
        }
      },
      boxShadow: {
        'glow-gold': '0 0 35px -5px rgba(251, 191, 36, 0.35)',
        'glow-purple': '0 0 35px -5px rgba(139, 92, 246, 0.3)',
        'glow-hero': '0 20px 80px -15px rgba(245, 158, 11, 0.2)',
        'card-hover': '0 20px 30px -10px rgba(0, 0, 0, 0.08)',
        'pill': '0 2px 8px -2px rgba(0, 0, 0, 0.05)',
      },
      backgroundImage: {
        'cta-gradient': 'linear-gradient(110deg, #121420 0%, #1A1D2D 40%, #3D3019 75%, #594519 100%)',
        'footer-gradient': 'linear-gradient(180deg, #090B12 0%, #06070B 100%)',
      }
    },
  },
  plugins: [],
}

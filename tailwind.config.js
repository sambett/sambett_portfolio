/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          500: '#4C1D95',
          600: '#3C0C85',
          700: '#2C0665',
          900: '#1A0044',
        },
        secondary: {
          50: '#ecfeff',
          500: '#0891B2',
          600: '#0E7490',
          700: '#155E75',
        },
        accent: {
          50: '#fff7ed',
          500: '#EA580C',
          600: '#DC2626',
          700: '#B91C1C',
        },
        success: {
          500: '#059669',
          600: '#047857',
          700: '#065F46',
        },
        warning: {
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      },
      backgroundImage: {
        'neural-gradient': 'linear-gradient(135deg, #4C1D95, #0891B2)',
        'warm-gradient': 'linear-gradient(135deg, #EA580C, #F59E0B)',
        'global-gradient': 'linear-gradient(135deg, #0891B2, #059669)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
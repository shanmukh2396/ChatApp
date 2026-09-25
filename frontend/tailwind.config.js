/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981', // Emerald Green Primary
          600: '#059669', // Hover Emerald
          700: '#047857', // Dark Emerald
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#10B981',
        },
        primary: {
          50:  '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10B981', // Emerald Green Primary
          600: '#059669', // Hover Emerald
          700: '#047857', // Dark Emerald
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
          DEFAULT: '#10B981',
        },
        forest: {
          950: '#05120a', // Near-black forest background
          900: '#071a0f', // Deep dark background
          850: '#0b2416', // Navigation bar surface
          800: '#0f2d1c', // Main dark surface
          750: '#133823',
          700: '#18422b', // Card & panel surface
          650: '#1e4d33', // Hover surface
          600: '#255c3e', // Border & divider
          500: '#347a55',
          400: '#4f9b71',
        },
        surface: {
          DEFAULT: '#0f2d1c',   // Dark forest green main
          darker:  '#071a0f',   // Deepest background
          nav:     '#0b2416',   // Navigation bar
          card:    '#18422b',   // Card / panel surface
          input:   '#0b2416',   // Input background
          border:  '#204e35',   // Border color
          hover:   '#1e4d33',   // Hover state
          light:   '#F7FDF9',   // Light theme surface
        },
        content: {
          main:  '#FFFFFF',
          muted: '#9bb8a8',
          dark:  '#0f2d1c',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.15s ease-out',
        'slide-up':   'slideUp 0.2s ease-out',
        'bounce-dot': 'bounceDot 1.2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple':     'ripple 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bounceDot: { '0%, 80%, 100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } },
        ripple:    { '0%': { transform: 'scale(0.8)', opacity: '1' }, '100%': { transform: 'scale(2.2)', opacity: '0' } },
      },
    },
  },
  plugins: [],
};

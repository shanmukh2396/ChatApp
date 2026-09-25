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
          50:  '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b4',
          400: '#fb718b',
          500: '#F20D3A', // Primary Red
          600: '#D90B32', // Hover Red
          700: '#A80729', // Dark Red
          800: '#8c0a25',
          900: '#4c0514',
          DEFAULT: '#F20D3A',
        },
        primary: {
          50:  '#fff1f3',
          100: '#ffe4e8',
          200: '#fecdd6',
          300: '#fda4b4',
          400: '#fb718b',
          500: '#F20D3A', // Primary Red
          600: '#D90B32', // Hover Red
          700: '#A80729', // Dark Red
          800: '#8c0a25',
          900: '#4c0514',
          DEFAULT: '#F20D3A',
        },
        navy: {
          950: '#0c0d15',
          900: '#11121d',
          850: '#131420',
          800: '#171827', // Dark navy base
          750: '#1c1e30',
          700: '#202235', // Secondary dark surface
          650: '#26283d', // Hover surface
          600: '#2c2f48',
          500: '#3d4263',
          400: '#585e8a',
        },
        surface: {
          DEFAULT: '#171827',   // Dark navy main
          darker:  '#11121d',   // Deepest background
          nav:     '#131420',   // Nav column
          card:    '#202235',   // Card / panel surface
          input:   '#131420',   // Input background
          border:  '#2a2c42',   // Border color
          hover:   '#26283d',   // Hover state
          light:   '#F7F7FA',   // Light theme surface
        },
        content: {
          main:  '#FFFFFF',
          muted: '#9293A5',
          dark:  '#222333',
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
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        bounceDot: { '0%, 80%, 100%': { transform: 'scale(0)' }, '40%': { transform: 'scale(1)' } },
      },
    },
  },
  plugins: [],
};

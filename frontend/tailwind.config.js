/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50:  '#FAFCF9',
          100: '#F4F6F2', // Warm off-white main background
          200: '#EAEFE8',
          DEFAULT: '#F4F6F2',
        },
        sage: {
          50:  '#F0F5EF',
          100: '#E3EBE2', // Pale sage panel & sidebar
          200: '#D5DFD4',
          300: '#C2D1C1',
          400: '#A4B8A3',
          DEFAULT: '#E3EBE2',
        },
        forest: {
          50:  '#F2F6F3',
          100: '#E0EAE2',
          200: '#B8CEBD',
          300: '#8FB198',
          400: '#6D9578',
          500: '#547A60', // Muted forest green Primary
          600: '#45664F', // Hover
          700: '#3A5643', // Active
          800: '#2F4335',
          900: '#26332B', // Deep charcoal green
          DEFAULT: '#547A60',
        },
        charcoal: {
          50:  '#809187',
          100: '#5C6D63',
          200: '#435249',
          DEFAULT: '#26332B', // Deep charcoal green main text
        },
        mint: {
          50:  '#F4F9F4',
          100: '#E5F0E5',
          200: '#D5E5D5', // Soft mint sent bubble
          300: '#C0D8C0',
          DEFAULT: '#D5E5D5',
        },
        brand: {
          50:  '#F4F6F2',
          100: '#E3EBE2',
          200: '#D5E5D5',
          300: '#8FB198',
          400: '#6D9578',
          500: '#547A60', // Primary action color
          600: '#45664F', // Hover
          700: '#3A5643', // Active
          800: '#2F4335',
          900: '#26332B',
          DEFAULT: '#547A60',
        },
        primary: {
          50:  '#F4F6F2',
          100: '#E3EBE2',
          200: '#D5E5D5',
          300: '#8FB198',
          400: '#6D9578',
          500: '#547A60',
          600: '#45664F',
          700: '#3A5643',
          800: '#2F4335',
          900: '#26332B',
          DEFAULT: '#547A60',
        },
        surface: {
          DEFAULT: '#F4F6F2',   // Warm off-white main
          panel:   '#E3EBE2',   // Pale sage sidebar/panel
          card:    '#FFFFFF',   // Clean card
          input:   '#FFFFFF',   // Input background
          border:  '#D8E2D7',   // Subtle border
          hover:   '#DCE6DB',   // Hover state
        },
        content: {
          main:  '#26332B',     // Deep charcoal green
          muted: '#5C6D63',     // Muted charcoal
          light: '#809187',
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


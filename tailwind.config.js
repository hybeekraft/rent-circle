/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#FFF3E8',
          100: '#FFE0C4',
          200: '#FFBF8A',
          400: '#FF8C42',
          500: '#F07020',
          600: '#C45A10',
          700: '#A04808',
          800: '#7A3505',
          900: '#4F2202',
        },
        ink: {
          50:  '#F8F6F2',
          100: '#EDEAD4',
          200: '#D5D0B8',
          400: '#9A9480',
          600: '#5C5748',
          800: '#2E2B22',
          900: '#1A1814',
        }
      },
      fontFamily: {
        sans: ['var(--font-sora)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.3s ease',
        'scale-in': 'scaleIn 0.2s ease',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        slideUp: { from: { opacity: '0', transform: 'translateY(24px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn: { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      }
    },
  },
  plugins: [],
}

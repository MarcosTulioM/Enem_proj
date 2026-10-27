/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        argon: {
          navy: '#0b1120',
          indigo: '#4f46e5',
          violet: '#7c3aed',
          gold: '#f59e0b',
        },
      },
      fontFamily: {
        display: ['Outfit', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        '3d-sm': '0 3px 0 0 #cbd5e1, 0 4px 10px -2px rgba(15, 23, 42, 0.08)',
        '3d-card': '0 6px 0 0 #e2e8f0, 0 12px 24px -4px rgba(15, 23, 42, 0.08)',
        '3d-card-hover': '0 8px 0 0 #cbd5e1, 0 20px 30px -6px rgba(15, 23, 42, 0.14)',
        '3d-emerald': '0 5px 0 0 #047857, 0 10px 20px -3px rgba(16, 185, 129, 0.35)',
        '3d-emerald-active': '0 2px 0 0 #047857, 0 4px 8px -2px rgba(16, 185, 129, 0.25)',
        '3d-indigo': '0 5px 0 0 #3730a3, 0 10px 20px -3px rgba(79, 70, 229, 0.35)',
        '3d-amber': '0 5px 0 0 #b45309, 0 10px 20px -3px rgba(245, 158, 11, 0.35)',
        '3d-rose': '0 5px 0 0 #be123c, 0 10px 20px -3px rgba(244, 63, 94, 0.35)',
        '3d-dark': '0 8px 0 0 #020617, 0 20px 40px -10px rgba(2, 6, 23, 0.5)',
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.08), inset 0 1px 0 0 rgba(255, 255, 255, 0.8)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        wine: {
          DEFAULT: '#5A1F1B',
          dark: '#3D1412',
          light: '#7A2B26',
        },
        beige: {
          DEFAULT: '#EAE3D9',
          dark: '#D4CAB8',
          light: '#F5F2EC',
        },
        sage: {
          DEFAULT: '#6FAF8D',
          dark: '#559070',
          light: '#8DC4A3',
        },
        gold: {
          DEFAULT: '#C9A46C',
          dark: '#A8834A',
          light: '#DFC08E',
        },
        brown: {
          DEFAULT: '#2A1A18',
          light: '#5C3D35',
          muted: '#8C6B63',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(42, 26, 24, 0.08)',
        'card-hover': '0 8px 40px rgba(42, 26, 24, 0.14)',
        gold: '0 0 0 1px rgba(201, 164, 108, 0.5)',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
    },
  },
  plugins: [],
};

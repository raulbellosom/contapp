const flowbite = require('flowbite-react/tailwind');

/** @type {import('tailwindcss').Config} \*/
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', flowbite.content()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      colors: {
        'contapp-danger': '#EF476F',
        'contapp-warning': '#FFD166',
        'contapp-success': '#06D6A0',
        'contapp-info': '#118AB2',
        'contapp-dark': '#141010',
        'contapp-light': '#FFFFFE',
        'contapp-gray': '#e7e5e4',
        'contapp-gray-dark': '#44403c',
        'contapp-primary': '#ff373d',
        'contapp-secondary': '#363636',
        'contapp-primary-light': '#ff6a6e',
        'contapp-primary-dark': '#ff040c',
        'contapp-secondary-light': '#ffffff',
      },
      fontSize: {
        xxs: '0.5rem', // Nuevo estilo para texto muy pequeño
      },
      animation: {
        shake: 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        shake: {
          '10%, 90%': {
            transform: 'translate3d(-1px, 0, 0)',
          },
          '20%, 80%': {
            transform: 'translate3d(2px, 0, 0)',
          },
          '30%, 50%, 70%': {
            transform: 'translate3d(-4px, 0, 0)',
          },
          '40%, 60%': {
            transform: 'translate3d(4px, 0, 0)',
          },
        },
      },
    },
  },
  plugins: [flowbite.plugin()],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '420px',  // extra-small breakpoint for tiny phones
      },
      fontFamily: {
        heading: ['"Fugaz One"', 'cursive'],
        body: ['"Fira Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#16a34a',
          light: '#22c55e',
          dark:  '#15803d',
        },
      },
      transitionProperty: {
        width: 'width',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Indie Flower', 'sans-serif'],
      },
      colors: {
        beige: '#f4f1de',
        fondo: '#676770',
        naranja: '#E07A5F',
        verdeClaro: '#81B29A',
        celeste: '#97E7F5',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ]
}

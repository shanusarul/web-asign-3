/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.html`],
  daisyui: {
    themes: ['light'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}


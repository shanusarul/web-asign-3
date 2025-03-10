/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [`./views/**/*.html`],
  daisyui: {
    themes: ['dark'],
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
}


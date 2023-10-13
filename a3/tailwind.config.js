/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      './views/**/*.html',
      './src/**/*.js',
    ]
  },
  daisyui: {
    themes: ['cupcake'],
  },
  theme: {
    extend: {
      maxWidth: {
        'custom-width': '1000px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('daisyui'),
  ],
}

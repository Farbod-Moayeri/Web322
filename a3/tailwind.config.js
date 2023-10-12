/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: {
    content: [
      './views/**/*.html',
      // you might also need to watch your js files if you use tailwind classes in them
      './src/**/*.js',
    ]
  },
  daisyui: {
    themes: ['cupcake'],
  },
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
}

/* eslint-disable no-undef */
module.exports = {
  content: ['./index.html', './**/*.{js}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: ["cmyk"],
  },
}
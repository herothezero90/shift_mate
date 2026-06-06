/* eslint-disable no-undef */
module.exports = {
  content: ['./index.html', './**/*.{js}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Poppins"', 'sans-serif'],
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
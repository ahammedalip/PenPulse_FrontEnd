// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        darkGray: '#393646',
        purpleGray: '#4F4557',
        mutedPurple: '#6D5D6E',
        lightCream: '#F4EEE0',
      },
    },
  },
  plugins: [],
}

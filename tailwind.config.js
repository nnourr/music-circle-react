/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fancy: ['Fancy', 'sans'],
        sans: ['LeagueSpartan', 'sans-serif']
      },
      fontSize: {
        "base": "2rem",
        "lg": "2.5rem",
        "xl": "5rem",
        "2xl": "11rem"
      },
      colors: {
        error: 'rgba(227,0,73,0.9)',
      }
    },
  },
  plugins: [],
}


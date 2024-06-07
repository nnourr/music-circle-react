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
        blackTrans: 'rgba(#000000, 0.8)'
      }
    },
  },
  plugins: [],
}


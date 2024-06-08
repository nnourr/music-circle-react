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
        "base": "1.5rem",
        "lg": "2rem",
        "xl": "3.5rem",
        "2xl": ["7rem", "1em"],
        "lg-base": "2rem",
        "lg-lg": "2.5rem",
        "lg-xl": "5rem",
        "lg-2xl": "11rem"
      },
      colors: {
        error: 'rgba(227,0,73,0.9)',
      }
    },
  },
  plugins: [],
}


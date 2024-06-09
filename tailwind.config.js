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
        "2xl": ["4rem"],
        "3xl": ["7rem", "1em"],
        "lg-base": "2rem",
        "lg-lg": "2.5rem",
        "lg-xl": "5rem",
        "lg-2xl": "8rem",
        "lg-3xl": "11rem"
      },
      colors: {
        error: 'rgba(227,0,73,0.9)',
      }, backgroundImage: {
        "radial-gradient": "radial-gradient(50% 50% at 50% 50% rgb(41 235 38) 0% rgb(63 177 171) 70% rgb(41 195 159) 100%)",
        "radial-gradient-alt": "radial-gradient(50% 50% at 50% 50% rgb(41 235 38) 0% rgb(41 195 159) 70% rgb(63 177 171) 100%)",
        "radial-gradient-error": "radial-gradient(50% 50% at 50% 50% rgb(41 235 38) 0% rgb(63 177 171) 20% rgb(41 195 159) 100%)",
        "linear-gradient": "linear-gradient(270deg, #29EB26 0%, #29C39F 51.5%, #3FB1AB 100%)",
        "linear-gradient-breathe-1": "linear-gradient(270deg #29EB26 0% #29C39F 30% #3FB1AB 100%)",
        "linear-gradient-breathe-2": "linear-gradient(270deg #29EB26 0% #29C39F 70% #3FB1AB 100%)",
      }
    },
  },
  plugins: [],
}


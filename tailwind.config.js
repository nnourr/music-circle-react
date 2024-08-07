/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1224px",
      xl: "2080px",
    },
    extend: {
      fontFamily: {
        fancy: ['Fancy', 'sans'],
        sans: ['LeagueSpartan', 'sans-serif']
      },
      fontSize: {
        "sm": "1.2rem",
        "base": "1.5rem",
        "lg": "2rem",
        "1xl": "2.5rem",
        "xl": "3.5rem",
        "2xl": ["4rem"],
        "3xl": ["7rem", "1em"],
        "lg-sm": "1.7rem",
        "lg-base": "2rem",
        "lg-lg": "2.5rem",
        "lg-1xl": "3.5rem",
        "lg-xl": "5rem",
        "lg-2xl": "8rem",
        "lg-3xl": "11rem"
      },
      colors: {
        error: 'rgba(227,0,73,0.9)',
        spotify: 'rgb(30,215,96)',
        "dark-teal": '#192B28',
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(50% 50% at 50% 50%, #29EB26 0%, #3FB1AB 70%, #29C39F 100%)",
        "radial-gradient-alt": "radial-gradient(50% 50% at 50% 50%, #29EB26 0%, #29C39F 70%, #3FB1AB 100%)",
        "radial-gradient-error": "radial-gradient(50% 50% at 50% 50%, #29EB26 0%, #3FB1AB 20%, #29C39F 100%)",
        "linear-gradient": "linear-gradient(275deg, #29EB26 0%, #29C39F 51.5%, #3FB1AB 100%)",
        "linear-gradient-breathe-1": "linear-gradient(275deg, #29EB26 0%, #29C39F 30%, #3FB1AB 100%)",
        "linear-gradient-breathe-2": "linear-gradient(275deg, #29EB26 0%, #29C39F 70%, #3FB1AB 100%)"
      },
      animation: {
        borderPulse: 'borderPulse 1s ease-in-out infinite',
      },
      keyframes: {
        borderPulse: {
          '0%, 100%': { borderWidth: '2px' },
          '50%': { borderWidth: '8px' },
        }
      },
    },
    plugins: [],
  }
}

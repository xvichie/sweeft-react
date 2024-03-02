/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}',],
  theme: {
    extend: {
      colors:{
        "main-cyan": "#36c5f0",
        "main-red": "#e01e5a",
        "main-yellow": "#ecb22e",
        "main-green": "#2eb67d",
        "main-purple": "#4a154b",
        "main-bg": "#eedaf2",
        "background-gray": "#f5f5f5",
      },
      fontFamily:{
        NinoMtavruli: ["Nino Mtavruli", "sans-serif"]
      }
    },
  },
  plugins: [],
}


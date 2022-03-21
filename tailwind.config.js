module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "1/20": "5%",
        "2/20": "10%",
        "3/20": "15%",
        "4/20": "20%",
        "5/20": "25%",
        "6/20": "30%",
        "7/20": "35%",
        "8/20": "40%",
        "9/20": "45%",
        "11/20": "55%",
        "12/20": "60%",
        "13/20": "65%",
        "14/20": "70%",
        "15/20": "75%",
        "16/20": "80%",
        "17/20": "85%",
        "18/20": "90%",
        "19/20": "95%",
        30: "120px",
        18: "4.5rem",
      },
      colors: {
        themedarkblue: "#192233",
        themeblue: "#212c42",
        themepurple: "#73089d",
        themesky: "#67a2cc",
        themegray: "#8b97ae",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  important: true,
  theme: {
    extend: {
            spacing: {
        13: '3.25rem',
        15: '3.75rem',
        18: '4.5rem',
        22: '5.5rem',
        26: '6.5rem',
        30: '7.5rem',
        50: '12.5rem',
        70: '17.5rem',
        90: '22.5rem',

        // Bigger values
        100: "25rem",
        120: "30rem",
        128: "32rem",
        140: "35rem",
        160: "40rem",
        180: "45rem",
        192: "48rem",
        200: "50rem",
        240: "60rem",
        256: "64rem",
        280: "70rem",
        320: "80rem",
        360: "90rem",
        400: "100rem",
        480: "120rem",

        // Fractional values
        "1/2": "50%",
        "1/3": "33.333333%",
        "2/3": "66.666667%",
        "1/4": "25%",
        "2/4": "50%",
        "3/4": "75%",
      },
      colors: {
        'error': '#F44336',
        'primary-blue': '#015BAB',
        'primary-yellow': '#FFF138',
      },
      dropShadow: {
        'action-button-scroll': '0px -22px 32.1px 0px #FFF'
      },
      fontSize: {
        'super-small': '.25rem'
      },
    },
  },
  plugins: [],
};

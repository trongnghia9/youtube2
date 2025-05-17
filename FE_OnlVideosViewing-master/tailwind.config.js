/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'ls': '0.5rem',
        '3.5xl': '2rem',
      },
      margin: {
        '0.25': '0.25px',
      },
      padding: {
        '1.25': '0.3125rem',
      },
      width: {
        '4.5': '1.125rem',
        '26': '6.5rem',
        '1/7': '14.285714%',
        '1/8': '12.5%',
        '1/9': '11.111111%',
        '1/10': '10%',
        '6/7': '85.714286%',
        '7/8': '87.5%',
        '8/9': '88.88889%',
        '10.5/12': '87.5%',
        '11.25/12': '93.75%',
        '11.5/12': '95.83334%',
        '11.75/12': '97.91667%',
      },
      height: {
        '0.1': '0.1px',
        '0.25': '0.25px',
        '4.5': '1.125rem',
        '62': '15.5rem',
        '112': '28rem',
      },
      inset: {
        '4.5': '1.125rem',
        '1/5': '20%',
        '1/6': '16.666667%',
        '1/7': '14.285714%',
        '1/8': '12.5%',
        '1/9': '11.111111%',
        '1/10': '10%',
        '1/11': '9.090909%',
        '1/12': '8.333333%',
        '1/13': '7.692308%',
        '1/14': '6.666667%',
        '1/15': '5.555556%',
        '1/16': '4.6875%',
        '1/17': '3.846154%',
        '1/18': '3.333333%',
        '1/19': '2.941176%',
        '1/20': '2.5%',
        '1/21': '2.142857%',
        '1/22': '1.904762%',
        '1/23': '1.666667%',
        '1/24': '1.458333%',
        '1/25': '1.25%',
      },
      colors: {
        // 'firstColor': '#2E5077',
        // 'secondColor': '#4DA1A9',
        // 'thirdColor': '#79D7BE',
        // 'fourthColor': '#F6F4F0',

        // 'firstColor': '#1A2D42',
        // 'secondColor': '#2E4156',
        // 'thirdColor': '#AAB7B7',
        // 'fourthColor': '#C0C8CA',
        // 'fifthColor': '#D4D8DD',

        // 'firstColor': '#161616',
        // 'secondColor': '#F26749',
        // 'thirdColor': '#F9D7CD',
        // 'fourthColor': '#FFEAE5',
        // 'fifthColor': '#FFFFFF',

        // 'firstColor': '#242529',
        // 'secondColor': '#FFF37A',
        // 'thirdColor': '#B1ACAB',
        // 'fourthColor': '#DCDCDC',
        // 'fifthColor': '#FFFFFF',

        'firstColor': '#252525',
        'secondColor': '#8D9192',
        'thirdColor': '#28809A',
        'fourthColor': '#EDEDED',
        'fifthColor': '#FFFFFF',

        // 'firstColor': '#252525',
        // 'secondColor': '#8D9192',
        // 'thirdColor': '#EDEDED',
        // 'fourthColor': '#FFFFFF',
        // 'fifthColor': '#28809A',
      },
      borderWidth: {
        '0.1': '0.1px',
        '0.25': '0.25px',
        '0.5': '0.5px',
        '1.25': '1.25px',
        '1.5': '1.5px',
        '3': '3px',
        '10': '10px',
      },
      borderRadius: {
        '1.5xl': '0.875rem',
        '2.25xl': '1.125rem',
        '2.5xl': '1.25rem',
        '2.75xl': '1.375rem',
      },
      boxShadow: {
        'xs': '0 1px 2px 0 rgb(0 0 0 / 0.025);'
      },
      transitionDuration: {
        '1500': '1.5s',
        '2000': '2s',
        '2500': '2.5s',
        '3000': '3s'
      },
      screens: {
        'computerScreen': '1792px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      ringWidth: {
        '5': '5px',
      },
      scale: {
        '97.5': '0.975',
        '99': '0.99',
      },
      opacity: {
        '97.5': '0.975',
      },
      gap: {
        '0.25': '1px',
      },
      keyframes: {
        'border-run': {
          '0%': { borderImage: 'linear-gradient(to right, #ff00ff, #00ffff) 1' },
          '25%': { borderImage: 'linear-gradient(to bottom, #ff00ff, #00ffff) 1' },
          '50%': { borderImage: 'linear-gradient(to left, #ff00ff, #00ffff) 1' },
          '75%': { borderImage: 'linear-gradient(to top, #ff00ff, #00ffff) 1' },
          '100%': { borderImage: 'linear-gradient(to right, #ff00ff, #00ffff) 1' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(100%)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        shake: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(10deg)' },
          '75%': { transform: 'rotate(-10deg)' },
        },
      },
      animation: {
        'border-run': 'border-run 2s linear infinite',
        shake: 'shake 1.5s ease-in-out infinite',
      },
      transitionDuration: {
        '600': '0.6s',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx,md,mdx}', './components/**/*.{js,jsx,ts,tsx,md,mdx}'],
  theme: {
    extend: {
      animation: {
        'spin-around': 'spin-around calc(var(--speed) * 2) infinite linear',
        slide: 'slide var(--speed) ease-in-out infinite alternate',
      },
      keyframes: {
        'spin-around': {
          '0%': {
            transform: 'translateZ(0) rotate(0)',
          },
          '15%, 35%': {
            transform: 'translateZ(0) rotate(90deg)',
          },
          '65%, 85%': {
            transform: 'translateZ(0) rotate(270deg)',
          },
          '100%': {
            transform: 'translateZ(0) rotate(360deg)',
          },
        },
        slide: {
          to: {
            transform: 'translate(calc(100cqw - 100%), 0)',
          },
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './rjsf-daisyui-theme/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
      },
      width: {
        '120': '30rem',
        '140': '35rem',
        '160': '40rem',
        '180': '45rem',
        '200': '50rem',
        '240': '60rem',
        '280': '70rem',
        '320': '80rem',
        '360': '90rem',
        '400': '100rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        '110': '110',
        '120': '120',
        '130': '130',
        '140': '140',
        '150': '150',
        '160': '160',
        '170': '170',
        '180': '180',
      },
      backgroundImage: {
        'gradient-radial':
          'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography")],
};

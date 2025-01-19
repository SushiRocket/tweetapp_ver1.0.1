/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', //mediaにするとシステム設定と連動
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#3abff8',
          DEFAULT: '#0ea5e9',
          dark: '#0284c7'
        }
      },
    },
  },
  plugins: [],
}


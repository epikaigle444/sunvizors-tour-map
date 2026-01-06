/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: '#cca52c',
        dark: '#1a1a1a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Or a specific font if they have one
      }
    },
  },
  plugins: [],
}

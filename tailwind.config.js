/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        corporate: {
          dark: '#002B49',   // Deep Blue Royal Navy
          accent: '#00A88F', // Bright Pulse Teal Green
          orange: '#FF7A00', // Highlight Amber Orange
          bg: '#F8FAFC'      // Elegant Premium Off-White
        }
      }
    },
  },
  plugins: [],
}
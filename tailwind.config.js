/ @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src//*.{js,jsx,ts,tsx}",
    "./public/index.html",
    ".//*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class', // Habilita el modo oscuro basado en clases
  theme: {
    extend: {
      // Puedes agregar colores personalizados aquí si quieres
      colors: {
        // Ejemplo: 'primary': '#your-color'
      }
    },
  },
  plugins: [],
}
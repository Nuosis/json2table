/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // Custom colors (adjust or remove as needed)
      colors: {
        primary: "#1a202c",  // Example primary color
        secondary: "#2d3748",  // Example secondary color
        accent: "#4a5568",  // Example accent color
        muted: "#718096",  // Example muted color
      },
      borderRadius: {
        lg: "12px",  // Example radius
        md: "10px",
        sm: "8px",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

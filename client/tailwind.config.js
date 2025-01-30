/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Menambahkan JSX dan TSX untuk React
  ],
  theme: {
    extend: {
      fontFamily: {
        century: ['"Century Gothic"', 'sans-serif'], // Tambahkan font ke daftar
      },
    },
  },
  plugins: [],
};

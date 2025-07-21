/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';

export default {
  content: [
    "./app/**/*.{ts,tsx,js,jsx}", // App Router
    "./pages/**/*.{ts,tsx,js,jsx}", // Legacy pages (si besoin)
    "./components/**/*.{ts,tsx,js,jsx}", // Si dossier séparé
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms, // Pour des formulaires natifs propres
  ],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    preflight: false, // Prevent Bootstrap conflicts
  },
  theme: {
    extend: {
      colors: {
        brand: {
          bg:        '#020617',
          surface:   '#0d1117',
          card:      '#0f172a',
          cardHover: '#111827',
          border:    '#1e293b',
          borderHi:  '#334155',
        }
      }
    },
  },
  plugins: [],
}

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
          primary:   '#FF6A00',
          hover:     '#FF7F1F',
          active:    '#E65C00',
          dark:      '#CC5200',
          glow:      '#FF8C42',
          bg:        '#0D0D0D',
          surface:   '#121212',
          panel:     '#1A1A1A',
          border:    '#2A2A2A',
          input:     '#333333',
        }
      }
    },
  },
  plugins: [],
}

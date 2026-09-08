/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#C5A059',
          light: '#E5C888',
          dark: '#9A7B3E',
          accent: '#AC805D',
        },
        beige: {
          DEFAULT: '#EFE6DD',
          light: '#FAF6F0',
          card: '#FDFBF7',
          tertiary: '#F5E7D6',
        },
        charcoal: '#1A1A1A',
        brownMuted: '#6E5D4F',
        borderGold: 'rgba(197, 160, 89, 0.35)',
      },
      fontFamily: {
        heading: ['Marcellus', 'Cormorant Garamond', 'Georgia', 'serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 30px rgba(197, 160, 89, 0.15)',
        subtle: '0 4px 20px rgba(0, 0, 0, 0.03)',
        medium: '0 12px 35px rgba(26, 26, 26, 0.07)',
        drawer: '-10px 0 40px rgba(0, 0, 0, 0.15)',
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#5a9068',
          greenDark: '#3d6b4a',
          greenDeep: '#243f2e',
          orange: '#E8771A',
        },
        surface: { black: '#0a0a08', dark: '#111109' },
        cream: '#f5f0e8',
        muted: '#888880',
      },
      fontFamily: {
        // Site-wide Georgian face (public/bpg_extrasquare_mtavruli_2009.ttf)
        sans: ['"BPG ExtraSquare Mtavruli"', 'system-ui', 'sans-serif'],
        bebas: ['"BPG ExtraSquare Mtavruli"', 'system-ui', 'sans-serif'],
        playfair: ['"BPG ExtraSquare Mtavruli"', 'system-ui', 'sans-serif'],
        dm: ['"BPG ExtraSquare Mtavruli"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

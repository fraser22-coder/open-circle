import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy:  { DEFAULT: '#1b1f3b', 2: '#303e66', 3: '#3c4f80' },
        gold:  '#f9d378',
        tan:   { 1: '#baa182', 2: '#c5b098', 3: '#d7c0a9' },
        circle: { green: '#52b788' },
      },
      fontFamily: { sans: ['Poppins', 'sans-serif'] },
    },
  },
  plugins: [],
}
export default config

// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: '#faf7f2',
        espresso: '#3d3025',
        tan: '#b8976a',
        warm: '#8b6f5e',
      },
      fontFamily: {
        serif: ['var(--font-garamond)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

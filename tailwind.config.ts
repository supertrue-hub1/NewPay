import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'admin-bg': '#0f111a',
        'admin-sidebar': '#1a1d2d',
        'admin-accent': '#00b6ff',
      }
    },
  },
  plugins: [],
}
export default config

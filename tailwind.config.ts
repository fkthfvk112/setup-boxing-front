import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0C10',
          card: '#15171E',
          cardElevated: '#1D202A',
          border: '#282C3A',
        },
        brand: {
          red: '#FF2E54',
          orange: '#FF6B00',
          amber: '#F59E0B',
          gold: '#FFD700',
          emerald: '#10B981',
        },
      },
    },
  },
  plugins: [],
};
export default config;

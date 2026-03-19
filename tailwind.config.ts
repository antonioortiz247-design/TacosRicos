import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#fff8ef',
          100: '#ffedd4',
          500: '#f97316',
          700: '#c2410c',
          900: '#7c2d12'
        }
      }
    }
  },
  plugins: []
};

export default config;

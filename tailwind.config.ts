import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff6ed',
          100: '#ffecd6',
          200: '#ffd6ad',
          300: '#ffbb7a',
          400: '#ff9a3d',
          500: '#FF7A00',
          600: '#e86f00',
          700: '#c75e00',
          800: '#9e4b00',
          900: '#7a3b00',
          950: '#3f1e00'
        },
        warm: {
          50: '#F5F5F5',
          100: '#ededed',
          500: '#FF7A00',
          700: '#c75e00',
          900: '#1F1F1F'
        },
        accent: {
          50: '#f3fde8',
          100: '#e3f9c8',
          200: '#c7f18f',
          300: '#a4e15a',
          400: '#8bd63b',
          500: '#7AC943',
          600: '#66b135',
          700: '#4f8c2a',
          800: '#3f6e23',
          900: '#335a1f',
          950: '#1a2f10'
        },
        ink: {
          50: '#f7f7f7',
          100: '#ececec',
          200: '#d4d4d4',
          300: '#b5b5b5',
          400: '#8A8A8A',
          500: '#6e6e6e',
          600: '#565656',
          700: '#3f3f3f',
          800: '#2b2b2b',
          900: '#1F1F1F',
          950: '#101010'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'soft-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;

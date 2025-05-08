import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/content/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#00347B',
          light: '#004aad',
          dark: '#001f4d',
        },
        accent: {
          DEFAULT: '#FED602',
          dark: '#cab200',
        },
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'scale(95%)' },
          '100%': { opacity: '1', transform: 'scale(100%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
      },
    },
  },
  plugins: [forms],
};

export default config;

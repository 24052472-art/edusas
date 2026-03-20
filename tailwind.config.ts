import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f0',
          100: '#faefd9',
          200: '#f5dbb2',
          300: '#eec282',
          400: '#e5a050',
          500: '#de8530',
          600: '#cf6c24',
          700: '#ac531f',
          800: '#8a431f',
          900: '#70381c',
          950: '#3c1b0d',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        beige: {
          50: '#fefcf8',
          100: '#fdf8ef',
          200: '#faf0dc',
          300: '#f5e3c0',
          400: '#eecf9a',
          500: '#e5b671',
          600: '#d4954a',
          700: '#b17538',
          800: '#8e5d30',
          900: '#734c29',
          950: '#3d2611',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config

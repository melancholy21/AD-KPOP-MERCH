/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        orange: {
          50: '#faf5ff',   // purple-50
          100: '#f3e8ff',  // purple-100
          200: '#e9d5ff',  // purple-200
          300: '#d8b4fe',  // purple-300
          400: '#c084fc',  // purple-400
          500: '#a855f7',  // purple-500 (Primary)
          600: '#9333ea',  // purple-600
          700: '#7e22ce',  // purple-700
          800: '#6b21a8',  // purple-800
          900: '#581c87',  // purple-900
        }
      },
      gridTemplateColumns:{
        'auto': 'repeat(auto-fit, minmax(200px, 1fr))'
      },
    },
  },
  plugins: [],
};

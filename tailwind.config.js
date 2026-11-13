/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // Custom "ink" palette used for the deep dark background layers.
      colors: {
        ink: {
          950: '#05060f',
          900: '#0a0c1c',
          800: '#11142b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Custom animations for floating glow blobs, fade-ins and the typing loader.
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(40px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, 30px) scale(0.95)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        blob: 'blob 14s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease-out both',
        'bounce-dot': 'bounceDot 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Mono', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        farm: {
          canvas: '#FDFBF7', // Off-white graph paper
          soil: '#1C1917',   // Heavy almost-black
          tractor: '#10B981', // John Deere style green
          sunburst: '#F59E0B', // Bright yellow-orange
          alert: '#EF4444',
          sky: '#3B82F6',
          muted: '#E7E5E4', // For empty states or secondary canvas
        },
        // Mapping legacy vyra/signal colors so nothing breaks
        signal: {
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#3B82F6',
        },
        slate: {
          bg: '#FDFBF7',
          surface: '#ffffff',
          panel: '#FDFBF7',
        }
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(28,25,23,1)',
        'brutal-hover': '8px 8px 0px 0px rgba(28,25,23,1)',
        'brutal-sm': '2px 2px 0px 0px rgba(28,25,23,1)',
        // Legacy bento maps to brutal now
        'bento': '4px 4px 0px 0px rgba(28,25,23,1)',
        'bento-hover': '8px 8px 0px 0px rgba(28,25,23,1)',
        'glow-green': '4px 4px 0px 0px rgba(16,185,129,1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'ticker': 'ticker 20s linear infinite',
        'glitch': 'glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}

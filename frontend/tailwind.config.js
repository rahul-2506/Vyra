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
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        farm: {
          canvas: '#FCF9F2',   // Very soft warm cream off-white background
          soil: '#2D2825',     // Warm dark charcoal/soil for text
          tractor: '#114227',  // Rich vibrant deep forest green
          forest: '#114227',   // Rich vibrant deep forest green
          leaf: '#249B55',     // Fresh crisp leaf green
          wheat: '#E28723',    // Rich golden wheat
          sunburst: '#E28723', // Rich golden wheat accent
          yellow: '#F5B041',   // Sunflower yellow
          alert: '#C0392B',    // Rich terracotta alert red
          sky: '#3498DB',      // Vibrant sky blue
          teal: '#0E8388',     // Vibrant irrigation teal
          clay: '#7D5139',     // Earth clay brown
          muted: '#EDE8DF',    // Warm light beige for panels/dividers
        },
        // Mapping legacy vyra/signal colors so nothing breaks
        signal: {
          green: '#2E7D32',
          amber: '#E29A45',
          red: '#B8554B',
          blue: '#508C9B',
        },
        slate: {
          bg: '#FCF9F2',
          surface: '#ffffff',
          panel: '#FCF9F2',
        }
      },
      boxShadow: {
        'brutal': '0 2px 8px rgba(45, 40, 37, 0.05)',
        'brutal-hover': '0 6px 16px rgba(45, 40, 37, 0.08)',
        'brutal-sm': '0 1px 2px rgba(45, 40, 37, 0.04)',
        'bento': '0 2px 8px rgba(45, 40, 37, 0.05)',
        'bento-hover': '0 6px 16px rgba(45, 40, 37, 0.08)',
        'glow-green': '0 0 12px rgba(62, 92, 71, 0.08)',
        'glass': '0 8px 32px 0 rgba(45, 40, 37, 0.04)',
        'glass-hover': '0 12px 40px 0 rgba(45, 40, 37, 0.08)',
        'clay-green': 'inset -4px -4px 8px rgba(27, 59, 43, 0.15), inset 4px 4px 8px rgba(255, 255, 255, 0.6), 0 12px 24px -10px rgba(27, 59, 43, 0.12)',
        'clay-gold': 'inset -4px -4px 8px rgba(125, 81, 57, 0.15), inset 4px 4px 8px rgba(255, 255, 255, 0.6), 0 12px 24px -10px rgba(125, 81, 57, 0.12)',
        'neumorphic': '3px 3px 6px #e4e2dd, -3px -3px 6px #ffffff',
        'neumorphic-inset': 'inset 2px 2px 5px #e4e2dd, inset -2px -2px 5px #ffffff',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'ticker': 'ticker 20s linear infinite',
        'glitch': 'glitch 0.2s cubic-bezier(.25, .46, .45, .94) both infinite',
        'scanline': 'scanline 8s linear infinite',
        'gradient-slow': 'gradientShift 15s ease infinite',
        'radar-slow': 'radar-sweep 8s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 4s ease-in-out infinite',
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
        },
        gradientShift: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'radar-sweep': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6', filter: 'drop-shadow(0 0 5px rgba(46, 125, 50, 0.2))' },
          '50%': { opacity: '1', filter: 'drop-shadow(0 0 15px rgba(46, 125, 50, 0.5))' },
        }
      }
    },
  },
  plugins: [],
}

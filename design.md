# Neo-Brutalism UI Design System Guide

This document serves as the blueprint for recreating the Vyra Neo-Brutalism UI in any new React + Tailwind CSS project.

## 1. Core Principles
- **No Softness**: Replace all drop-shadows with solid block shadows (`#000` or `#fff`).
- **High Contrast**: Use stark, pure web colors (Pure Yellow, Shocking Pink, Neon Green).
- **Thick Borders**: Every interactive element should have a heavy border (`border-[3px]` or `border-[4px]`).
- **Tactile Interactions**: Buttons shouldn't fade on hover; they should physically "depress" by translating down and right, losing their drop shadow to simulate a physical button press.
- **Aggressive Typography**: Use uppercase letters for labels, strong font weights (`font-black`, `font-bold`), and mono-spaced fonts for headers.

---

## 2. Dependencies
To set up a new project with this UI, you will need:
```bash
npm install tailwindcss postcss autoprefixer framer-motion lucide-react
```

---

## 3. Typography
Import these fonts in your main CSS file (`index.css`):
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap');
```
- **Primary (Body):** `Inter` (used for readable text, inputs, buttons).
- **Display (Headers):** `Space Mono` (used for massive headers, numbers, and retro vibes).

---

## 4. Tailwind Configuration (`tailwind.config.js`)
Use this configuration to set up the pure brutalist colors and hard shadows.

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Mono', 'monospace'],
      },
      colors: {
        brutal: {
          bg: 'var(--brutal-bg)',
          text: 'var(--brutal-text)',
          border: 'var(--brutal-border)',
          surface: 'var(--brutal-surface)',
          muted: 'var(--brutal-muted)',
          
          // Pure accent colors
          yellow: '#FFE800',
          pink: '#FF90E8',
          green: '#BAFCA2',
          blue: '#80D7FF',
          orange: '#FF5722',
        },
      },
      boxShadow: {
        'brutal-sm': '2px 2px 0px 0px var(--brutal-border)',
        'brutal':    '4px 4px 0px 0px var(--brutal-border)',
        'brutal-lg': '8px 8px 0px 0px var(--brutal-border)',
      },
    },
  },
  plugins: [],
}
```

---

## 5. CSS Variables and Base Layers (`index.css`)
Define the CSS variables to easily flip between light and dark brutalist modes.

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --brutal-bg: #F4F4F0;
    --brutal-text: #111111;
    --brutal-border: #000000;
    --brutal-surface: #FFFFFF;
    --brutal-muted: #E2E2E2;
  }

  .dark {
    --brutal-bg: #1A1A1A;
    --brutal-text: #FFFFFF;
    --brutal-border: #FFFFFF;
    --brutal-surface: #222222;
    --brutal-muted: #333333;
  }

  body {
    background-color: var(--brutal-bg);
    color: var(--brutal-text);
    font-weight: 500;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Space Mono', monospace;
    @apply font-bold uppercase tracking-tight;
  }
}

@layer components {
  /* Cards */
  .card {
    @apply bg-brutal-surface border-[3px] border-brutal-border p-5 shadow-brutal transition-all duration-150;
  }
  .card:hover {
    @apply -translate-y-1 -translate-x-1 shadow-brutal-lg;
  }

  /* Buttons */
  .btn {
    @apply inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wider transition-all duration-150 border-[3px] border-brutal-border shadow-brutal cursor-pointer;
  }
  .btn:active:not(:disabled) {
    @apply translate-x-1 translate-y-1 shadow-none;
  }
  .btn-primary { @apply btn px-5 py-3 bg-brutal-yellow text-black; }
  
  /* Inputs */
  .input {
    @apply w-full bg-brutal-surface border-[3px] border-brutal-border px-4 py-3 text-sm text-brutal-text outline-none transition-all duration-150 shadow-[2px_2px_0px_0px_var(--brutal-border)];
  }
  .input:focus {
    @apply shadow-brutal bg-brutal-yellow text-black translate-x-[-2px] translate-y-[-2px];
  }
  .input::placeholder {
    color: var(--brutal-text);
    opacity: 0.5;
  }
}
```

---

## 6. Framer Motion Animations (`animations.js`)
Neo-brutalism feels physical and clunky. Replace smooth easing curves with aggressive spring physics.

```javascript
// lib/animations.js
export const brutalistSpring = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 1,
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } }
}

export const staggerItem = {
  initial: { opacity: 0, y: 20, rotate: -2 }, // Slight rotation adds quirkiness
  animate: { opacity: 1, y: 0, rotate: 0 },
  transition: brutalistSpring,
}
```

---

## 7. Signature UI Elements

### The "Press" Effect
Whenever making a custom interactive element, apply this combination of classes to simulate a brutalist button press:
```html
<button className="border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all">
  Click Me
</button>
```

### The Background Grid
To add a "drafting paper" look to your main layout, apply this to the background wrapper:
```html
<div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
     style={{ backgroundImage: 'radial-gradient(var(--brutal-text) 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}>
</div>
```

### The "Title Bar" Decorative Dots
Used heavily in Command Palettes and Modals to mimic retro OS windows:
```html
<div className="h-4 bg-brutal-border w-full flex items-center px-2 gap-1.5 border-b-[4px] border-brutal-border">
  <div className="w-2 h-2 bg-brutal-pink rounded-full" />
  <div className="w-2 h-2 bg-brutal-yellow rounded-full" />
  <div className="w-2 h-2 bg-brutal-green rounded-full" />
</div>
```

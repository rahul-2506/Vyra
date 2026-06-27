# Premium Agritech Layout & Design Guide

This document serves as the guide for the Vyra interface. It documents design tokens, typography, visual hierarchy, layout rhythm, components, and animations.

## 1. Core Principles

- **Visual Rhythm & Layout Hierarchy**: Break uniform, repetitive grids. Stagger modules using varying card spans (Span 4, 8, 12) to group high-contrast metrics alongside subtle sensor data.
- **Layering & Depth**: Guide reading flow by stacking visual layers. Use `.glass-card` (frosted glass overlays) for telemetry readings, standard cards for content blocks, and `.clay-card` (double inner shadows) for highlighted recommendations or warnings.
- **Sunrise color Palette**: Utilize an organic agricultural palette (Deep Forest Green, Leaf Green, Golden Wheat, Morning Teal, Soil Brown, Warm Cream) representing farmland during sunrise, avoiding over-saturated neon gaming colors.
- **Subtle Micro-Interactions**: Hover transformations, soft scales, magnetic button properties, and clean progress arcs must provide functional telemetry details rather than literal decoration.
- **Inter globally**: Enforce the clean sans-serif typeface `Inter` for display headers and body layouts, maintaining a professional enterprise feel.

---

## 2. Design Tokens

### Colors
- **Canvas (Background)**: `#FCF9F2` (Warm Cream Farmland)
- **Soil (Primary Text)**: `#2D2825` (Soft Charcoal)
- **Tractor (Deep Forest Green)**: `#1B3B2B`
- **Leaf (Fresh Green)**: `#2E7D32`
- **Wheat (Golden Accent)**: `#E29A45`
- **Yellow (Sunflower Yellow)**: `#F4B942`
- **Alert (Clay Red)**: `#B8554B`
- **Sky (Mineral Blue)**: `#508C9B`
- **Teal (Morning Teal)**: `#3A7D80`
- **Clay (Earth Brown)**: `#7D5139`
- **Muted (Secondary Beige)**: `#EDE8DF`

### Card Layers & Shadows
- **Standard Card Shadow**: `0 2px 8px rgba(45, 40, 37, 0.05)`
- **Glassmorphic Card Shadow**: `0 8px 32px 0 rgba(45, 40, 37, 0.04)`
- **Claymorphic Green Shadow**: `inset -4px -4px 8px rgba(27, 59, 43, 0.15), inset 4px 4px 8px rgba(255, 255, 255, 0.6), 0 12px 24px -10px rgba(27, 59, 43, 0.12)`
- **Neumorphic Control Shadow**: `3px 3px 6px #e4e2dd, -3px -3px 6px #ffffff`
- **Neumorphic Inset Shadow**: `inset 2px 2px 5px #e4e2dd, inset -2px -2px 5px #ffffff`

---

## 3. Core Component Rules

### Glassmorphic Cards
Frosted glass overlays are configured for most metrics:
```css
.glass-card {
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(12px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 8px 32px 0 rgba(45, 40, 37, 0.04);
}
```

### Neumorphic Controls
Select inputs, toggle sliders, and switch tracks utilize neumorphism:
```css
.neumorphic-inset {
  background: #FCF9F2;
  box-shadow: inset 2px 2px 5px #e4e2dd, inset -2px -2px 5px #ffffff;
}
```

### Claymorphic Highlight Zones
High-priority alerts or AI recommendation banners utilize claymorphism:
```css
.clay-card-gold {
  background: rgba(252, 246, 238, 0.85);
  box-shadow: inset -4px -4px 8px rgba(125, 81, 57, 0.15), inset 4px 4px 8px rgba(255, 255, 255, 0.6), 0 12px 24px -10px rgba(125, 81, 57, 0.12);
}
```

---

## 4. Motion Guidelines

Motion should reinforce transition continuity, loading progress, and parameter thresholds.

```javascript
// lib/animations.js
export const calmSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { type: 'tween', ease: 'easeOut', duration: 0.2 },
}
```

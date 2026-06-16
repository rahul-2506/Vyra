export const bouncySpring = {
  type: 'spring',
  stiffness: 400,
  damping: 15,
  mass: 0.8,
}

export const harshTween = {
  type: 'tween',
  ease: 'circOut',
  duration: 0.2
}

export const pageTransition = {
  initial: { opacity: 0, x: -20, y: 20 },
  animate: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 20, y: -20 },
  transition: bouncySpring,
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 40, scale: 0.9 },
  animate: { opacity: 1, y: 0, scale: 1 },
  transition: bouncySpring,
}

export const popIn = {
  initial: { opacity: 0, scale: 0.5, rotate: -5 },
  animate: { opacity: 1, scale: 1, rotate: 0 },
  exit: { opacity: 0, scale: 0.8, rotate: 5 },
  transition: bouncySpring,
}

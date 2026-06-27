export const calmSpring = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
  mass: 1,
}

export const smoothTween = {
  type: 'tween',
  ease: 'easeOut',
  duration: 0.2
}

export const pageTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: smoothTween,
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02
    }
  }
}

export const staggerItem = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: calmSpring,
}

export const popIn = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: smoothTween,
}

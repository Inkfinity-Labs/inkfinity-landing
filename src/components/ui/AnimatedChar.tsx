import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface AnimatedCharProps {
  char: string
  index: number
  shouldRipple?: boolean // Kept for backward compatibility
}

const AnimatedChar: React.FC<AnimatedCharProps> = ({
  char,
  index,
  shouldRipple = false // Not used anymore
}) => {
  const controls = useAnimation()
  
  useEffect(() => {
    // Reset animation when component is mounted or re-rendered
    controls.set("hidden")
    controls.start("visible")
    
    return () => {
      controls.stop()
    }
  }, [controls])
  
  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.03,
        duration: 0.3,
        ease: "easeOut"
      }
    })
  }
  
  return (
    <motion.span
      custom={index}
      variants={letterAnimation}
      initial="hidden"
      animate={controls}
      className="inline-block mx-[1px] relative"
      style={{ 
        width: char === ' ' ? '0.5em' : 'auto',
      }}
    >
      {/* Regular character */}
      <span className="relative z-10">
        {char}
      </span>
    </motion.span>
  )
}

export default AnimatedChar 
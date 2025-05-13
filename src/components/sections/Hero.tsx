import React, { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'next-i18next'
import { ArrowDown } from 'lucide-react'
import { motion, useAnimation } from 'framer-motion'
import Image from 'next/image'
import AnimatedPhrase from '../../components/ui/AnimatedPhrase'

export default function Hero() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const [isVisible, setIsVisible] = useState(true)
  const heroRef = useRef<HTMLElement>(null)
  const initialAnimationDone = useRef(false)

  const taglineText = t('hero.tagline')
  const taglinePhrases = taglineText.split('.')
    .filter(phrase => phrase.trim().length > 0)
    .map(phrase => phrase.trim())

  useEffect(() => {
    // Start animation when component mounts
    if (!initialAnimationDone.current) {
      // Small delay to ensure everything is ready after preloader
      setTimeout(() => {
        controls.start("visible")
        initialAnimationDone.current = true
      }, 200)
    }
    
    const handleScroll = () => {
      if (!heroRef.current) return
      
      // Get hero element position and dimensions
      const heroRect = heroRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      
      // Check if hero is in viewport
      const isElementVisible = 
        heroRect.top < windowHeight && 
        heroRect.bottom > 0
      
      setIsVisible(isElementVisible)
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [controls])

  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  return (
    <section 
      ref={heroRef}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      <motion.div
        className="container mx-auto px-4 text-center z-10 relative"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <motion.div
          variants={itemVariants}
          className="mb-8"
        >
          <motion.div 
            className="flex justify-center mb-12"
            variants={itemVariants}
          >
            <Image 
              src="/images/inkfinity-logo.png" 
              alt="Inkfinity Logo" 
              width={700} 
              height={700}
              className="brightness-0 invert max-w-full h-auto"
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </motion.div>
          
          <motion.div 
            className="relative py-4 mb-16"
            variants={itemVariants}
          >            
            <div className="flex items-center justify-center overflow-x-auto px-4 py-4">
              <div className="inline-flex flex-nowrap">
                {isVisible && taglinePhrases.map((phrase, phraseIndex) => (
                  <AnimatedPhrase
                    key={phraseIndex}
                    phrase={phrase}
                    phraseIndex={phraseIndex}
                    isLastPhrase={phraseIndex === taglinePhrases.length - 1}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/*scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 0.7 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white/30 rounded-full mt-2"
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        </div>
      </motion.div>
    </section>
  )
} 
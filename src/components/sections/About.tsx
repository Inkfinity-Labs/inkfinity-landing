import React, { useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import { motion, useAnimation } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useInView } from 'react-intersection-observer'

// Carga dinámica del modelo 3D
const ThreeDModel = dynamic(() => import('../ui/ThreeDModel'), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full w-full text-white text-lg">Cargando visualizador 3D...</div>
})

export default function About() {
  const { t } = useTranslation()
  const featureKeys = ['feature1', 'feature2', 'feature3', 'feature4']
  
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px"
  })
  
  useEffect(() => {
    // Start animation with a slight delay when in view to prevent jank
    if (inView) {
      setTimeout(() => {
        controls.start('visible')
      }, 100)
    }
  }, [inView])
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
        when: "beforeChildren"
      }
    }
  }
  
  const leftItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  }
  
  const rightItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 }
    }
  }
  
  const listItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        delay: i * 0.05 
      }
    })
  }

  return (
    <section id="about" className="py-20">
      <motion.div 
        ref={ref}
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="relative flex justify-start"
            variants={leftItemVariants}
          >
            <div className="w-[1500px] h-[900px] relative flex justify-end items-center z-10">
              <ThreeDModel />
            </div>
          </motion.div>

          <motion.div 
            className="space-y-6"
            variants={rightItemVariants}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white"
              variants={rightItemVariants}
            >
              {t('about.title')}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-white/70"
              variants={rightItemVariants}
            >
              {t('about.description')}
            </motion.p>

            <ul className="space-y-4">
              {featureKeys.map((key, index) => (
                <motion.li
                  key={key}
                  className="flex items-start"
                  custom={index}
                  variants={listItemVariants}
                >
                  <div className="bg-white/90 text-black rounded-full p-1 mr-3 mt-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-white/90">{t(`about.${key}`)}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
} 
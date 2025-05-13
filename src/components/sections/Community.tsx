import React from 'react'
import { useTranslation } from 'next-i18next'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '../../components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'

export default function Community() {
  const { t } = useTranslation()
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px"
  })

  useEffect(() => {
    // Start animation with a slight delay when in view
    if (inView) {
      setTimeout(() => {
        controls.start('visible')
      }, 100)
    }
  }, [inView])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <section id="community" className="relative py-20">
      <motion.div 
        className="absolute inset-0 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute w-full h-full backdrop-blur-sm"></div>
      </motion.div>

      <motion.div 
        ref={ref}
        className="container mx-auto px-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div className="space-y-8">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-white"
              variants={itemVariants}
            >
              {t('community.title')}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-white/80"
              variants={itemVariants}
            >
              {t('community.description')}
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Button
                size="lg"
                className="group bg-white text-black hover:bg-white/90"
                onClick={() => window.location.href = '/early-access'}
              >
                {t('community.earlyAccess')}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
                onClick={() => window.location.href = '/demo'}
              >
                {t('community.viewDemo')}
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 
import React, { useState } from 'react'
import { useTranslation } from 'next-i18next'
import { motion, useAnimation } from 'framer-motion'
import { Button } from '../../components/ui/button'
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

  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.message || 'Something went wrong')

      setStatus('success')
      setMessage(t('community.joinSuccess'))
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : t('community.joinError'))
    }
  }

  useEffect(() => {
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
              variants={itemVariants}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex w-full max-w-xl gap-2 justify-center">
                <form className="flex space-x-2" onSubmit={handleSubmit}>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    placeholder={t('community.emailPlaceholder')}
                    className="w-64 px-4 py-1 bg-black/30 border rounded-lg border-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading' || status === 'success'}
                  />
                  <Button
                    className="bg-white text-black hover:bg-white/90 disabled:opacity-50"
                    disabled={status === 'loading' || status === 'success'}
                    type="submit"
                  >
                    {status === 'loading' ? t('community.joining') : status === 'success' ? t('community.joined') : t('community.join')}
                  </Button>
                </form>

                <Button
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                  onClick={() => window.location.href = '/demo'}
                >
                  {t('community.viewDemo')}
                </Button>
              </div>
              {message && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={status === 'error' ? 'text-red-500' : 'text-emerald-500'}
                >
                  {message}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
} 
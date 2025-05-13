import React from 'react'
import { useTranslation } from 'next-i18next'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LucideIcon } from 'lucide-react'
import {
  Coins,
  LineChart,
  Image as ImageIcon,
  LayoutDashboard,
  Puzzle,
  Calendar,
} from 'lucide-react'
import { useInView } from 'react-intersection-observer'

interface Feature {
  title: string
  description: string
  icon: LucideIcon
  comingSoon?: boolean
}

const features: Feature[] = [
  {
    title: 'features.crypto.title',
    description: 'features.crypto.description',
    icon: Coins,
  },
  {
    title: 'features.oracle.title',
    description: 'features.oracle.description',
    icon: LineChart,
  },
  {
    title: 'features.nft.title',
    description: 'features.nft.description',
    icon: ImageIcon,
  },
  {
    title: 'features.dashboard.title',
    description: 'features.dashboard.description',
    icon: LayoutDashboard,
  },
  {
    title: 'features.controller.title',
    description: 'features.controller.description',
    icon: Puzzle,
  },
  {
    title: 'features.bookings.title',
    description: 'features.bookings.description',
    icon: Calendar,
    comingSoon: true,
  },
]

export default function Features() {
  const { t } = useTranslation()
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px"
  })
  
  const [cardsRef, cardsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: "0px"
  })

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={headerRef}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            {t('features.title')}
          </h2>
          <p className="text-white/80 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {t('features.description')}
          </p>
        </motion.div>

        <motion.div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          animate={cardsInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.title} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: index * 0.1,
                ease: "easeOut"
              }}
              className="h-full"
            >
              <Card 
                className="group h-full relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-1 bg-black/60 backdrop-blur-md border-white/20 before:absolute before:inset-0 before:-translate-x-[150%] before:animate-[shimmer_6s_cubic-bezier(0.3,_0,_0.7,_1)_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent before:w-[75%] before:skew-x-[-20deg]"
                tabIndex={0}
                role="article"
                aria-labelledby={`feature-title-${index}`}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative p-3 rounded-xl bg-gradient-to-br from-white/15 to-white/5 transition-colors duration-30 group-focus:ring-2 group-focus:ring-white/30">
                      <feature.icon className="h-7 w-7 text-white transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                    </div>
                    {feature.comingSoon && (
                      <span className="text-xs font-medium text-white/90 bg-white/10 px-3 py-1.5 rounded-full transition-colors duration-300 group-hover:bg-white/15">
                        {t('features.comingSoon')}
                      </span>
                    )}
                  </div>
                  <CardTitle 
                    id={`feature-title-${index}`}
                    className="text-xl font-semibold text-white relative transition-colors duration-300 group-hover:text-white/90"
                  >
                    {t(feature.title)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-base leading-relaxed relative transition-colors duration-300 group-hover:text-white/80">
                    {t(feature.description)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 
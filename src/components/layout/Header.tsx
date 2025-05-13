import React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Globe } from 'lucide-react'
import { Button } from '../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import GlowingButton from '../../components/ui/GlowingButton'
import { getUrl } from '@/config/urls'

const navItems = [
  { href: '#about', label: 'nav.about' },
  { href: '#features', label: 'nav.features' },
  { href: '#community', label: 'nav.community' },
  { href: getUrl('nav.whitepaper'), label: 'nav.whitepaper', isExternal: true },
]

export default function Header() {
  const { t } = useTranslation()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const changeLanguage = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
  }

  const appUrl = getUrl('nav.app')

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-black/20 backdrop-blur-md' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-inkfinity text-2xl text-white">
          Inkfinity
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 hover:text-white transition-colors"
              {...(item.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
            >
              {t(item.label)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-white" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => changeLanguage('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => changeLanguage('es')}>
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <GlowingButton
            className="hidden md:flex"
            size="default"
            onClick={() => window.location.href = appUrl}
          >
            {t('nav.launchApp')}
          </GlowingButton>
        </div>
      </div>
    </motion.header>
  )
} 
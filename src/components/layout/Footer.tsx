import React from 'react'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Globe, ArrowUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getUrl } from '@/config/urls'

const footerLinks = [
  { href: getUrl('footer.whitepaper'), label: 'footer.whitepaper', isExternal: true },
  { href: getUrl('footer.github'), label: 'footer.github', isExternal: true },
  { href: getUrl('footer.discord'), label: 'footer.discord', isExternal: true },
  { href: getUrl('footer.terms'), label: 'footer.terms', isExternal: true },
  { href: getUrl('footer.privacy'), label: 'footer.privacy', isExternal: true },
  { href: getUrl('footer.X'), label: 'footer.X', isExternal: true },
  { href: getUrl('footer.telegram'), label: 'footer.telegram', isExternal: true },
]

export default function Footer() {
  const { t } = useTranslation()
  const router = useRouter()

  const changeLanguage = (locale: string) => {
    const { pathname, asPath, query } = router
    router.push({ pathname, query }, asPath, { locale })
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="bg-transparent border-t border-white/10">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="font-inkfinity text-2xl text-white">
              Inkfinity
            </Link>
            <p className="mt-2 text-white/60">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-white/60 hover:text-white transition-colors"
                {...(link.isExternal && { target: "_blank", rel: "noopener noreferrer" })}
              >
                {t(link.label)}
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-end space-y-4">
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

            <Button
              variant="ghost"
              size="icon"
              onClick={scrollToTop}
              className="rounded-full text-white"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/60">
          <p>© {new Date().getFullYear()} Inkfinity. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  )
} 
import React, { useState, useEffect, useRef } from 'react'
import Header from './Header'
import Footer from './Footer'
import { BackgroundGradientAnimation } from '../../components/ui/background-gradient-animation'
import Preloader from '../../components/ui/Preloader'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [loading, setLoading] = useState(true)
  const loadingCompleted = useRef(false)
  
  const handleLoadingComplete = () => {
    setLoading(false)
    loadingCompleted.current = true
  }
  
  // Prefetch critical images and resources
  useEffect(() => {
    const imagesToPreload = [
      '/images/inkfinity-logo.png',
      '/images/inkfinity-man-logo.png'
    ]
    
    // Preload images
    imagesToPreload.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])
  
  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Only show preloader during initial loading */}
      {loading && <Preloader onLoadingComplete={handleLoadingComplete} />}
      
      {/* Main content */}
      <div 
        className={`transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}
      >
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(15, 15, 15)"
          gradientBackgroundEnd="rgb(0, 0, 0)"
          firstColor="120, 120, 120"
          secondColor="180, 180, 180"
          thirdColor="80, 80, 80"
          fourthColor="30, 30, 30"
          fifthColor="220, 220, 220"
        />
        <div className="relative z-10">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </div>
    </div>
  )
} 
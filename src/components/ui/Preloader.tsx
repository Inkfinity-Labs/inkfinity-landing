import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

interface PreloaderProps {
  onLoadingComplete: () => void;
  minimumDisplayTime?: number;
}

export default function Preloader({ 
  onLoadingComplete, 
  minimumDisplayTime = 2500 
}: PreloaderProps) {
  const [showLoader, setShowLoader] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)
  const minTimeElapsed = useRef(false)
  const pageLoaded = useRef(false)
  
  // Handle minimum display time
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeElapsed.current = true
      checkCompletion()
    }, minimumDisplayTime)
    
    return () => clearTimeout(timer)
  }, [minimumDisplayTime])
  
  // Handle page load event
  useEffect(() => {    
    // Check if document is already loaded
    if (document.readyState === 'complete') {
      pageLoaded.current = true
      checkCompletion()
    } else {
      // Listen for window load event
      const handleLoad = () => {
        pageLoaded.current = true
        checkCompletion()
      }
      
      window.addEventListener('load', handleLoad)
      
      return () => {
        window.removeEventListener('load', handleLoad)
      }
    }
  }, [])
  
  // Check if both conditions are met to complete loading
  const checkCompletion = () => {
    if (minTimeElapsed.current && pageLoaded.current) {
      // First fade out
      setFadeOut(true)
      
      // Then completely remove from DOM
      setTimeout(() => {
        setShowLoader(false)
        // Notify parent after transition is complete
        onLoadingComplete()
      }, 1000)
    }
  }

  if (!showLoader) {
    return null // Completely remove from DOM
  }

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-black transition-opacity duration-1000 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: fadeOut ? 'none' : 'auto' }}
    >
      <div className="relative w-32 h-32 mb-8">
        <Image
          src="/images/inkfinity-logo.png"
          alt="Inkfinity"
          width={128}
          height={128}
          className="brightness-0 invert max-w-full h-auto opacity-80"
          priority
        />
      </div>
      
      {/* Simple loading animation */}
      <div className="flex space-x-2">
        <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "300ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-white/60 animate-pulse" style={{ animationDelay: "600ms" }}></div>
      </div>
    </div>
  )
} 
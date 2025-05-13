import React, { useEffect, useRef } from 'react';

interface GlowingButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  size?: 'default' | 'sm' | 'lg';
}

export default function GlowingButton({ 
  children, 
  className = '',
  onClick,
  size = 'default'
}: GlowingButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;
    
    let angle = 0;
    let animationFrameId: number;
    let isAnimating = true;
    
    const rotate = () => {
      if (!isAnimating) return;
      
      angle = (angle + 1) % 360; // Increment angle and keep it within 0-360
      button.style.setProperty("--angle", `${angle}deg`);
      animationFrameId = requestAnimationFrame(rotate);
    };
    
    // Start the animation
    rotate();
    
    // Keep animation running even when tab is not visible
    const handleVisibilityChange = () => {
      isAnimating = !document.hidden;
      if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(rotate);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Cleanup animation frame on unmount
    return () => {
      isAnimating = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Size classes based on the size prop
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm rounded-md',
    default: 'h-10 px-4 py-2 rounded-md',
    lg: 'h-11 px-8 rounded-md'
  };
  
  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center
        font-medium
        outline-none border-[1.5px] border-transparent 
        text-white cursor-pointer
        transition-all duration-300
        ${sizeClasses[size]}
        hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]
        active:scale-95
        ${className}`}
      style={{
        background: `
          linear-gradient(black, black) padding-box,
          conic-gradient(
            from var(--angle, 0deg),
            transparent,
            white 10%,
            transparent 20%
          ) border-box
        `
      }}
    >
      {children}
    </button>
  );
} 
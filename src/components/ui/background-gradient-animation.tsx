"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { cn } from "../../lib/utils";
 
export const BackgroundGradientAnimation = memo(({
  gradientBackgroundStart = "rgb(15, 15, 15)",
  gradientBackgroundEnd = "rgb(0, 0, 0)",
  firstColor = "120, 120, 120",
  secondColor = "180, 180, 180",
  thirdColor = "80, 80, 80",
  fourthColor = "30, 30, 30",
  fifthColor = "220, 220, 220",
  pointerColor = "150, 150, 150",
  size = "100%",
  blendingValue = "overlay",
  children,
  className,
  interactive = false,
  containerClassName,
}: {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);
 
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);
  const [isSafari, setIsSafari] = useState(false);
  
  // Use a single useEffect for CSS variable setup to reduce effect hook counts
  useEffect(() => {
    // Set CSS variables once on component mount
    const applyStyles = () => {
      document.body.style.setProperty(
        "--gradient-background-start",
        gradientBackgroundStart
      );
      document.body.style.setProperty(
        "--gradient-background-end",
        gradientBackgroundEnd
      );
      document.body.style.setProperty("--first-color", firstColor);
      document.body.style.setProperty("--second-color", secondColor);
      document.body.style.setProperty("--third-color", thirdColor);
      document.body.style.setProperty("--fourth-color", fourthColor);
      document.body.style.setProperty("--fifth-color", fifthColor);
      document.body.style.setProperty("--pointer-color", pointerColor);
      document.body.style.setProperty("--size", size);
      document.body.style.setProperty("--blending-value", blendingValue);
    };
    
    applyStyles();
    
    // Detect Safari browser
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
    
    // Cleanup function
    return () => {
      // Optional: clean up CSS variables when component unmounts
      // Uncomment if needed, but might affect other instances
      // document.body.style.removeProperty("--gradient-background-start");
      // ...and so on for other properties
    };
  }, []); // Empty dependency array means this effect runs once on mount
 
  // Optimization: Use requestAnimationFrame for smoother animation
  useEffect(() => {
    if (!interactive) return;
    
    let animationFrameId: number;
    
    const move = () => {
      if (!interactiveRef.current) {
        return;
      }
      
      setCurX(prevX => prevX + (tgX - prevX) / 20);
      setCurY(prevY => prevY + (tgY - prevY) / 20);
      
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      
      animationFrameId = requestAnimationFrame(move);
    };
 
    animationFrameId = requestAnimationFrame(move);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [tgX, tgY, curX, curY, interactive]);
 
  // Memoize the mouse move handler to prevent unnecessary re-renders
  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !interactiveRef.current) return;
    
    const rect = interactiveRef.current.getBoundingClientRect();
    setTgX(event.clientX - rect.left);
    setTgY(event.clientY - rect.top);
  }, [interactive]);
 
  // Precompute CSS classes for better performance
  const gradientContainerClass = cn(
    "gradients-container h-full w-full blur-lg",
    isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
  );
  
  const baseGradientClass = `absolute [mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)] opacity-100`;
  
  const firstGradientClass = cn(
    baseGradientClass,
    `[background:radial-gradient(circle_at_center,_rgba(var(--first-color),_0.8)_0,_rgba(var(--first-color),_0)_50%)_no-repeat]`,
    `[transform-origin:center_center]`,
    `animate-first`
  );
  
  const secondGradientClass = cn(
    baseGradientClass,
    `[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_0.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]`,
    `[transform-origin:calc(50%-400px)]`,
    `animate-second`
  );
  
  const thirdGradientClass = cn(
    baseGradientClass,
    `[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_0.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]`,
    `[transform-origin:calc(50%+400px)]`,
    `animate-third`
  );
  
  const fourthGradientClass = cn(
    baseGradientClass,
    `[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_0.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]`,
    `[transform-origin:calc(50%-200px)]`,
    `animate-fourth`,
    `opacity-70`
  );
  
  const fifthGradientClass = cn(
    baseGradientClass,
    `[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_0.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]`,
    `[transform-origin:calc(50%-800px)_calc(50%+800px)]`,
    `animate-fifth`
  );
  
  const interactiveGradientClass = cn(
    `absolute [background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_0.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]`,
    `[mix-blend-mode:var(--blending-value)] w-full h-full -top-1/2 -left-1/2`,
    `opacity-70`
  );
 
  return (
    <div
      className={cn(
        "fixed h-screen w-screen overflow-hidden top-0 left-0 bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div className={gradientContainerClass}>
        <div className={firstGradientClass}></div>
        <div className={secondGradientClass}></div>
        <div className={thirdGradientClass}></div>
        <div className={fourthGradientClass}></div>
        <div className={fifthGradientClass}></div>
 
        {interactive && (
          <div
            ref={interactiveRef}
            onMouseMove={handleMouseMove}
            className={interactiveGradientClass}
          ></div>
        )}
      </div>
    </div>
  );
});

// Add display name to fix ESLint react/display-name error
BackgroundGradientAnimation.displayName = 'BackgroundGradientAnimation'; 
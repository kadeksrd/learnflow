'use client'
import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface MarqueeTextProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  speed?: number // Duration in seconds
}

export function MarqueeText({
  children,
  className,
  containerClassName,
  speed = 8
}: MarqueeTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && contentRef.current) {
        const container = containerRef.current
        const content = contentRef.current
        const isOverflowing = content.scrollWidth > container.clientWidth
        setShouldAnimate(isOverflowing)
        setContainerWidth(container.clientWidth)
      }
    }

    checkOverflow()

    const observer = new ResizeObserver(checkOverflow)
    if (containerRef.current) observer.observe(containerRef.current)
    
    return () => observer.disconnect()
  }, [children])

  return (
    <div
      ref={containerRef}
      className={cn(
        'overflow-hidden relative flex-1 min-w-0',
        shouldAnimate && 'animate-marquee-auto',
        containerClassName
      )}
      style={{ 
        ['--container-width' as any]: `${containerWidth}px`,
        animationDuration: `${speed}s`
      } as React.CSSProperties}
    >
      <div
        ref={contentRef}
        className={cn(
          'marquee-content whitespace-nowrap w-max',
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

"use client"

import React from 'react'
import Image from 'next/image'

interface WatermarkProps {
  src?: string
  alt?: string
  opacity?: number
  size?: number
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'
  className?: string
  grayscale?: boolean
}

export function Watermark({ 
  src = "/images/custom-logo.png", 
  alt = "EvolveCX Watermark",
  opacity = 0.3,
  size = 120,
  position = 'bottom-right',
  className = "",
  grayscale = false
}: WatermarkProps) {
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4'
      case 'top-right':
        return 'top-4 right-4'
      case 'top-left':
        return 'top-4 left-4'
      case 'center':
        return 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      default: // bottom-right
        return 'bottom-4 right-4'
    }
  }

  return (
    <div 
      className={`fixed pointer-events-none z-50 ${getPositionClasses()} ${className}`}
      style={{ opacity }}
    >
      <div 
        className="rounded-lg p-2"
        style={{
          backgroundColor: 'rgba(209, 213, 219, 0.5)',
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-contain"
          priority={false}
        />
      </div>
    </div>
  )
}

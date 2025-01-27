"use client"

interface HighlightedTextProps {
  children: React.ReactNode
  className?: string
}

export function HighlightedText({ children, className = "" }: HighlightedTextProps) {
  return (
    <span className={`highlight ${className}`}>
      {children}
    </span>
  )
}
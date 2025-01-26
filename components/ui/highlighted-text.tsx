"use client"

import { cn } from "@/lib/utils"

interface HighlightedTextProps {
  children: React.ReactNode
  className?: string
}

export function HighlightedText({ children, className }: HighlightedTextProps) {
  return (
    <span className={cn("highlight", className)}>
      {children}
    </span>
  )
}
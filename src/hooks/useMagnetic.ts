import { useRef, useState, useCallback } from 'react'

interface MagneticState {
  x: number
  y: number
}

export function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<MagneticState>({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const deltaX = (e.clientX - centerX) * strength
    const deltaY = (e.clientY - centerY) * strength
    setPosition({ x: deltaX, y: deltaY })
  }, [strength])

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return { ref, position, handleMouseMove, handleMouseLeave }
}

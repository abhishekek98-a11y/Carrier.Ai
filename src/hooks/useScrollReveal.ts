import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function useScrollReveal(_threshold: number = 0.2) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  return { ref, isInView }
}

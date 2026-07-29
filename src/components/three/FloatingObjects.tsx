import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FloatingObjectsProps {
  count?: number
  className?: string
}

type ShapeType = 'sphere' | 'cube' | 'octahedron'

interface ObjectConfig {
  shape: ShapeType
  position: [number, number, number]
  scale: number
  color: string
  emissive: string
  rotationSpeed: [number, number, number]
  floatSpeed: number
  floatIntensity: number
  opacity: number
}

interface FloatingShapeProps {
  config: ObjectConfig
  index: number
}

// ─── Palette ──────────────────────────────────────────────────────────────────

const COLORS = [
  { color: '#8b5cf6', emissive: '#4c1d95' }, // violet
  { color: '#22d3ee', emissive: '#0e7490' }, // cyan
  { color: '#d946ef', emissive: '#86198f' }, // fuchsia
  { color: '#a78bfa', emissive: '#5b21b6' }, // light violet
  { color: '#67e8f9', emissive: '#155e75' }, // light cyan
  { color: '#e879f9', emissive: '#701a75' }, // light fuchsia
]

// ─── Shape Generator ──────────────────────────────────────────────────────────

function generateObjects(count: number): ObjectConfig[] {
  const shapes: ShapeType[] = ['sphere', 'cube', 'octahedron']
  const objects: ObjectConfig[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const radius = 3 + Math.random() * 2.5
    const palette = COLORS[i % COLORS.length]

    objects.push({
      shape: shapes[i % shapes.length],
      position: [
        Math.cos(angle) * radius * (0.8 + Math.random() * 0.4),
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 3 - 1,
      ],
      scale: 0.08 + Math.random() * 0.14,
      color: palette.color,
      emissive: palette.emissive,
      rotationSpeed: [
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
      ],
      floatSpeed: 1 + Math.random() * 2,
      floatIntensity: 0.3 + Math.random() * 0.7,
      opacity: 0.25 + Math.random() * 0.35,
    })
  }

  return objects
}

// ─── Floating Shape ───────────────────────────────────────────────────────────

function FloatingShape({ config, index }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x += config.rotationSpeed[0]
      meshRef.current.rotation.y += config.rotationSpeed[1]
      meshRef.current.rotation.z += config.rotationSpeed[2]

      // Subtle pulsing scale
      const pulse = 1 + Math.sin(t * 1.5 + index * 0.7) * 0.08
      meshRef.current.scale.setScalar(config.scale * pulse)
    }
  })

  const geometry = useMemo(() => {
    switch (config.shape) {
      case 'sphere':
        return <sphereGeometry args={[1, 16, 16]} />
      case 'cube':
        return <boxGeometry args={[1, 1, 1]} />
      case 'octahedron':
        return <octahedronGeometry args={[1, 0]} />
    }
  }, [config.shape])

  return (
    <Float
      speed={config.floatSpeed}
      rotationIntensity={0.4}
      floatIntensity={config.floatIntensity}
    >
      <mesh
        ref={meshRef}
        position={config.position}
        scale={config.scale}
      >
        {geometry}
        <meshStandardMaterial
          color={config.color}
          emissive={config.emissive}
          emissiveIntensity={0.6}
          transparent
          opacity={config.opacity}
          roughness={0.2}
          metalness={0.8}
          wireframe={config.shape !== 'sphere'}
          side={THREE.DoubleSide}
        />
      </mesh>
    </Float>
  )
}

// ─── Mouse Parallax Layer ─────────────────────────────────────────────────────

function ParallaxGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { viewport } = useThree()
  const smoothMouse = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const targetX = (state.pointer.x * viewport.width) / 2
    const targetY = (state.pointer.y * viewport.height) / 2

    smoothMouse.current.x += (targetX * 0.08 - smoothMouse.current.x) * 0.03
    smoothMouse.current.y += (targetY * 0.08 - smoothMouse.current.y) * 0.03

    if (groupRef.current) {
      groupRef.current.position.x = smoothMouse.current.x
      groupRef.current.position.y = smoothMouse.current.y
      groupRef.current.rotation.y = smoothMouse.current.x * 0.03
      groupRef.current.rotation.x = -smoothMouse.current.y * 0.03
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Scene Content ────────────────────────────────────────────────────────────

function ObjectsScene({ count }: { count: number }) {
  const objects = useMemo(() => generateObjects(count), [count])

  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 5, 5]} color="#8b5cf6" intensity={1.5} distance={15} decay={2} />
      <pointLight position={[-5, -3, 3]} color="#22d3ee" intensity={1} distance={15} decay={2} />
      <pointLight position={[0, 3, -5]} color="#d946ef" intensity={1} distance={15} decay={2} />

      <ParallaxGroup>
        {objects.map((config, i) => (
          <FloatingShape key={i} config={config} index={i} />
        ))}
      </ParallaxGroup>
    </>
  )
}

// ─── FloatingObjects Component ────────────────────────────────────────────────

export default function FloatingObjects({
  count = 8,
  className,
}: FloatingObjectsProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <ObjectsScene count={count} />
      </Canvas>
    </div>
  )
}

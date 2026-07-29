import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus, Stars } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Scene3DProps {
  className?: string
}

interface FloatingTorusProps {
  position: [number, number, number]
  rotation: [number, number, number]
  color: string
  size?: number
  speed?: number
}

interface MouseReactiveProps {
  children: React.ReactNode
  intensity?: number
}

// ─── AI Core Sphere ───────────────────────────────────────────────────────────

function AICoreSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
      meshRef.current.rotation.y += 0.003
      meshRef.current.rotation.z = Math.cos(t * 0.15) * 0.05
    }
    if (glowRef.current) {
      const scale = 1.15 + Math.sin(t * 1.5) * 0.05
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Main AI Sphere */}
        <Sphere ref={meshRef} args={[0.8, 64, 64]}>
          <MeshDistortMaterial
            color="#8b5cf6"
            emissive="#4c1d95"
            emissiveIntensity={0.4}
            roughness={0.1}
            metalness={0.9}
            distort={0.3}
            speed={2}
            transparent
            opacity={0.9}
          />
        </Sphere>

        {/* Holographic glow shell */}
        <Sphere ref={glowRef} args={[0.95, 32, 32]}>
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Inner glow core */}
        <Sphere args={[0.4, 32, 32]}>
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={0.15}
          />
        </Sphere>
      </group>
    </Float>
  )
}

// ─── Floating Torus ───────────────────────────────────────────────────────────

function FloatingTorus({
  position,
  rotation,
  color,
  size = 1.4,
  speed = 1,
}: FloatingTorusProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = rotation[0] + t * 0.15 * speed
      meshRef.current.rotation.y = rotation[1] + t * 0.1 * speed
      meshRef.current.rotation.z = rotation[2] + t * 0.08 * speed
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
      <Torus
        ref={meshRef}
        args={[size, 0.015, 16, 100]}
        position={position}
        rotation={rotation}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          wireframe
          transparent
          opacity={0.6}
        />
      </Torus>
    </Float>
  )
}

// ─── Particle Field ───────────────────────────────────────────────────────────

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 2500

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Distribute particles in a spherical volume
      const radius = 3 + Math.random() * 7
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)

      sizes[i] = Math.random() * 2 + 0.5
    }

    return { positions, sizes }
  }, [])

  const particleTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    gradient.addColorStop(0, 'rgba(139, 92, 246, 1)')
    gradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.6)')
    gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 32, 32)
    const texture = new THREE.CanvasTexture(canvas)
    return texture
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.02
      pointsRef.current.rotation.x = Math.sin(t * 0.05) * 0.05
      // Subtle breathing effect
      const scale = 1 + Math.sin(t * 0.3) * 0.02
      pointsRef.current.scale.setScalar(scale)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#8b5cf6"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={particleTexture}
      />
    </points>
  )
}

// ─── Dynamic Lights ───────────────────────────────────────────────────────────

function DynamicLights() {
  const violet = useRef<THREE.PointLight>(null!)
  const cyan = useRef<THREE.PointLight>(null!)
  const fuchsia = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (violet.current) {
      violet.current.position.x = Math.sin(t * 0.4) * 3
      violet.current.position.y = Math.cos(t * 0.3) * 2
      violet.current.position.z = Math.sin(t * 0.5) * 2
      violet.current.intensity = 2 + Math.sin(t * 0.8) * 0.5
    }

    if (cyan.current) {
      cyan.current.position.x = Math.cos(t * 0.35) * 3
      cyan.current.position.y = Math.sin(t * 0.45) * 2
      cyan.current.position.z = Math.cos(t * 0.3) * 2
      cyan.current.intensity = 2 + Math.cos(t * 0.7) * 0.5
    }

    if (fuchsia.current) {
      fuchsia.current.position.x = Math.sin(t * 0.5 + 2) * 3
      fuchsia.current.position.y = Math.cos(t * 0.4 + 1) * 2
      fuchsia.current.position.z = Math.sin(t * 0.35 + 1.5) * 2
      fuchsia.current.intensity = 2 + Math.sin(t * 0.9) * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight ref={violet} color="#8b5cf6" intensity={2} distance={10} decay={2} />
      <pointLight ref={cyan} color="#22d3ee" intensity={2} distance={10} decay={2} />
      <pointLight ref={fuchsia} color="#d946ef" intensity={2} distance={10} decay={2} />
    </>
  )
}

// ─── Mouse Reactive Wrapper ───────────────────────────────────────────────────

function MouseReactive({ children, intensity = 0.15 }: MouseReactiveProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const { viewport } = useThree()
  const target = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    // Normalize mouse position
    const mouseX = (state.pointer.x * viewport.width) / 2
    const mouseY = (state.pointer.y * viewport.height) / 2

    // Smooth lerp toward mouse
    target.current.x += (mouseX * intensity - target.current.x) * 0.05
    target.current.y += (mouseY * intensity - target.current.y) * 0.05

    if (groupRef.current) {
      groupRef.current.position.x = target.current.x
      groupRef.current.position.y = target.current.y
      groupRef.current.rotation.y = target.current.x * 0.05
      groupRef.current.rotation.x = -target.current.y * 0.05
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Main Scene Content ───────────────────────────────────────────────────────

function SceneContent() {
  return (
    <>
      <DynamicLights />

      <MouseReactive intensity={0.15}>
        <AICoreSphere />

        {/* Orbiting torus rings */}
        <FloatingTorus
          position={[0, 0, 0]}
          rotation={[Math.PI / 4, 0, 0]}
          color="#8b5cf6"
          size={1.5}
          speed={0.8}
        />
        <FloatingTorus
          position={[0, 0, 0]}
          rotation={[0, Math.PI / 3, Math.PI / 6]}
          color="#22d3ee"
          size={1.8}
          speed={0.6}
        />
        <FloatingTorus
          position={[0, 0, 0]}
          rotation={[Math.PI / 6, Math.PI / 4, 0]}
          color="#d946ef"
          size={2.1}
          speed={0.4}
        />
      </MouseReactive>

      <ParticleField />

      <Stars
        radius={50}
        depth={50}
        count={1000}
        factor={2}
        saturation={0.5}
        fade
        speed={0.5}
      />
    </>
  )
}

// ─── Scene3D Component ────────────────────────────────────────────────────────

export default function Scene3D({ className }: Scene3DProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <SceneContent />
      </Canvas>
    </div>
  )
}

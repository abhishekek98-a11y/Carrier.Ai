import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeroSceneProps {
  className?: string
}

// ─── Large Central AI Sphere ──────────────────────────────────────────────────

function HeroAISphere() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const outerGlowRef = useRef<THREE.Mesh>(null!)
  const innerGlowRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.15) * 0.08
      meshRef.current.rotation.y += 0.004
      meshRef.current.rotation.z = Math.cos(t * 0.12) * 0.04
    }

    // Pulsing glow effect
    if (outerGlowRef.current) {
      const pulse = 1.2 + Math.sin(t * 1.2) * 0.08
      outerGlowRef.current.scale.setScalar(pulse)
      const mat = outerGlowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.06 + Math.sin(t * 1.2) * 0.03
    }

    if (innerGlowRef.current) {
      const innerPulse = 0.55 + Math.sin(t * 1.8 + 0.5) * 0.05
      innerGlowRef.current.scale.setScalar(innerPulse)
    }
  })

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
      <group>
        {/* Primary AI sphere with distortion */}
        <Sphere ref={meshRef} args={[1, 128, 128]}>
          <MeshDistortMaterial
            color="#7c3aed"
            emissive="#5b21b6"
            emissiveIntensity={0.5}
            roughness={0.05}
            metalness={0.95}
            distort={0.35}
            speed={2.5}
            transparent
            opacity={0.92}
          />
        </Sphere>

        {/* Outer holographic glow shell */}
        <Sphere ref={outerGlowRef} args={[1.2, 32, 32]}>
          <meshBasicMaterial
            color="#a78bfa"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Inner energy core */}
        <Sphere ref={innerGlowRef} args={[1, 32, 32]}>
          <meshBasicMaterial
            color="#e9d5ff"
            transparent
            opacity={0.12}
          />
        </Sphere>

        {/* Second glow layer for depth */}
        <Sphere args={[1.35, 16, 16]}>
          <meshBasicMaterial
            color="#c084fc"
            transparent
            opacity={0.03}
            side={THREE.BackSide}
          />
        </Sphere>
      </group>
    </Float>
  )
}

// ─── Orbiting Ring System ─────────────────────────────────────────────────────

interface OrbitRingProps {
  radius: number
  tubeRadius: number
  tilt: [number, number, number]
  color: string
  speed: number
  direction: number
}

function OrbitRing({ radius, tubeRadius, tilt, color, speed, direction }: OrbitRingProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = tilt[0] + t * speed * 0.1 * direction
      meshRef.current.rotation.y = tilt[1] + t * speed * 0.08 * direction
      meshRef.current.rotation.z = tilt[2] + t * speed * 0.06
    }
  })

  return (
    <Torus
      ref={meshRef}
      args={[radius, tubeRadius, 16, 128]}
      rotation={tilt}
    >
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        wireframe
        transparent
        opacity={0.45}
        side={THREE.DoubleSide}
      />
    </Torus>
  )
}

function OrbitingRings() {
  return (
    <group>
      {/* Ring 1 — Violet, wide tilt */}
      <OrbitRing
        radius={1.8}
        tubeRadius={0.012}
        tilt={[Math.PI / 3.5, 0, 0]}
        color="#8b5cf6"
        speed={1}
        direction={1}
      />

      {/* Ring 2 — Cyan, opposite angle */}
      <OrbitRing
        radius={2.2}
        tubeRadius={0.01}
        tilt={[-Math.PI / 5, Math.PI / 4, Math.PI / 8]}
        color="#22d3ee"
        speed={0.7}
        direction={-1}
      />

      {/* Ring 3 — Fuchsia, steep angle */}
      <OrbitRing
        radius={2.6}
        tubeRadius={0.008}
        tilt={[Math.PI / 6, -Math.PI / 3, 0]}
        color="#d946ef"
        speed={0.5}
        direction={1}
      />
    </group>
  )
}

// ─── Particle Cloud ───────────────────────────────────────────────────────────

function ParticleCloud() {
  const pointsRef = useRef<THREE.Points>(null!)
  const particleCount = 2000

  const positions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Concentrated sphere + outer halo distribution
      const isInner = Math.random() < 0.4
      const radius = isInner
        ? 1.2 + Math.random() * 1.5
        : 2.5 + Math.random() * 5

      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      arr[i3] = radius * Math.sin(phi) * Math.cos(theta)
      arr[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      arr[i3 + 2] = radius * Math.cos(phi)
    }
    return arr
  }, [])

  const particleSprite = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(167, 139, 250, 1)')
    gradient.addColorStop(0.25, 'rgba(139, 92, 246, 0.7)')
    gradient.addColorStop(0.6, 'rgba(124, 58, 237, 0.2)')
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (pointsRef.current) {
      pointsRef.current.rotation.y = t * 0.015
      pointsRef.current.rotation.x = Math.sin(t * 0.04) * 0.03

      // Breathing scale
      const breathe = 1 + Math.sin(t * 0.4) * 0.015
      pointsRef.current.scale.setScalar(breathe)
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#a78bfa"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={particleSprite}
      />
    </points>
  )
}

// ─── Holographic Grid Plane ───────────────────────────────────────────────────

function HolographicGrid() {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const shaderData = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#8b5cf6') },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vFade;
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          float dist = length(worldPos.xz);
          vFade = smoothstep(6.0, 1.0, dist);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColor;
        varying vec2 vUv;
        varying float vFade;

        void main() {
          vec2 grid = abs(fract(vUv * 20.0 - 0.5) - 0.5);
          float line = min(grid.x, grid.y);
          float gridLine = 1.0 - smoothstep(0.0, 0.04, line);

          // Pulsing scanline
          float scan = smoothstep(0.48, 0.5, fract(vUv.y * 5.0 - uTime * 0.1));

          float alpha = (gridLine * 0.15 + scan * 0.03) * vFade;

          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
    []
  )

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -2, 0]}
    >
      <planeGeometry args={[12, 12, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        {...shaderData}
      />
    </mesh>
  )
}

// ─── Lighting ─────────────────────────────────────────────────────────────────

function HeroLights() {
  const violetRef = useRef<THREE.PointLight>(null!)
  const cyanRef = useRef<THREE.PointLight>(null!)
  const fuchsiaRef = useRef<THREE.PointLight>(null!)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (violetRef.current) {
      violetRef.current.position.set(
        Math.sin(t * 0.3) * 4,
        Math.cos(t * 0.2) * 2 + 1,
        Math.sin(t * 0.4) * 3
      )
      violetRef.current.intensity = 3 + Math.sin(t * 0.6) * 0.8
    }

    if (cyanRef.current) {
      cyanRef.current.position.set(
        Math.cos(t * 0.25) * 4,
        Math.sin(t * 0.35) * 2 - 1,
        Math.cos(t * 0.3) * 3
      )
      cyanRef.current.intensity = 2 + Math.cos(t * 0.5) * 0.6
    }

    if (fuchsiaRef.current) {
      fuchsiaRef.current.position.set(
        Math.sin(t * 0.4 + 2) * 3,
        Math.cos(t * 0.3 + 1) * 2,
        Math.sin(t * 0.25 + 1.5) * 3
      )
      fuchsiaRef.current.intensity = 2.5 + Math.sin(t * 0.7) * 0.5
    }
  })

  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight ref={violetRef} color="#8b5cf6" intensity={3} distance={12} decay={2} />
      <pointLight ref={cyanRef} color="#22d3ee" intensity={2} distance={12} decay={2} />
      <pointLight ref={fuchsiaRef} color="#d946ef" intensity={2.5} distance={12} decay={2} />
    </>
  )
}

// ─── Mouse Tracking Parallax ──────────────────────────────────────────────────

function MouseParallax({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<THREE.Group>(null!)
  const { viewport } = useThree()
  const smooth = useRef({ x: 0, y: 0 })

  useFrame((state) => {
    const targetX = (state.pointer.x * viewport.width) / 2
    const targetY = (state.pointer.y * viewport.height) / 2

    smooth.current.x += (targetX * 0.12 - smooth.current.x) * 0.04
    smooth.current.y += (targetY * 0.12 - smooth.current.y) * 0.04

    if (groupRef.current) {
      groupRef.current.position.x = smooth.current.x
      groupRef.current.position.y = smooth.current.y
      groupRef.current.rotation.y = smooth.current.x * 0.04
      groupRef.current.rotation.x = -smooth.current.y * 0.04
    }
  })

  return <group ref={groupRef}>{children}</group>
}

// ─── Scene Content ────────────────────────────────────────────────────────────

function HeroSceneContent() {
  return (
    <>
      <HeroLights />

      <MouseParallax>
        <HeroAISphere />
        <OrbitingRings />
      </MouseParallax>

      <ParticleCloud />
      <HolographicGrid />
    </>
  )
}

// ─── HeroScene Component ──────────────────────────────────────────────────────

export default function HeroScene({ className }: HeroSceneProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
      >
        <HeroSceneContent />
      </Canvas>
    </div>
  )
}

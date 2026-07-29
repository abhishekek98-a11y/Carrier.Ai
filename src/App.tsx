import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/HeroSection'
import TrustedBySection from './components/sections/TrustedBySection'
import AboutSection from './components/sections/AboutSection'
import FeaturesSection from './components/sections/FeaturesSection'
import ChatDemoSection from './components/sections/ChatDemoSection'
import DashboardSection from './components/sections/DashboardSection'
import WorkflowSection from './components/sections/WorkflowSection'
import ShowcaseSection from './components/sections/ShowcaseSection'
import ContactSection from './components/sections/ContactSection'
import Footer from './components/layout/Footer'

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 100)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0C0C0C]"
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold gradient-text-primary">
          NexusAI
        </h1>
      </motion.div>

      {/* Progress bar */}
      <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #8b5cf6, #d946ef, #22d3ee)',
            width: `${Math.min(progress, 100)}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Progress text */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm text-gray-500 tracking-widest uppercase"
      >
        Initializing AI Systems
      </motion.p>

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-[120px]" />
      </div>
    </motion.div>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="relative noise-overlay">
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen
            key="loader"
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

      {!isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Navbar />
          <main>
            <HeroSection />
            <TrustedBySection />
            <AboutSection />
            <FeaturesSection />
            <ChatDemoSection />
            <DashboardSection />
            <WorkflowSection />
            <ShowcaseSection />
            <ContactSection />
          </main>
          <Footer />
        </motion.div>
      )}
    </div>
  )
}

export default App

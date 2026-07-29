import { useState, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Check, Loader2, Send } from 'lucide-react'

interface FormData {
  name: string
  email: string
  message: string
}

interface FocusState {
  name: boolean
  email: boolean
  message: boolean
}

function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength
      setPosition({ x: deltaX, y: deltaY })
    },
    [strength]
  )

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 })
  }, [])

  return { ref, position, handleMouseMove, handleMouseLeave }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
}

export default function ContactSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  })

  const [focused, setFocused] = useState<FocusState>({
    name: false,
    email: false,
    message: false,
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const magnetic = useMagnetic(0.25)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleFocus = (field: keyof FocusState) => {
    setFocused((prev) => ({ ...prev, [field]: true }))
  }

  const handleBlur = (field: keyof FocusState) => {
    setFocused((prev) => ({ ...prev, [field]: false }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setIsSuccess(false), 4000)
  }

  const isLabelFloating = (field: keyof FormData) =>
    focused[field] || formData[field].length > 0

  return (
    <section
      id="contact"
      className="relative py-32 md:py-40 lg:py-48 overflow-hidden"
      ref={sectionRef}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-16 md:mb-20"
        >
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="text-white">Let's Build</span>
            <br />
            <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
              Intelligent Support
            </span>
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Ready to transform your customer experience? Let's start the
            conversation.
          </motion.p>
        </motion.div>

        {/* Contact Form Glass Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-2xl mx-auto"
        >
          <motion.div
            variants={itemVariants}
            className="relative rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 lg:p-12"
          >
            {/* Card glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-violet-500/5 via-transparent to-fuchsia-500/5 pointer-events-none" />

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col items-center justify-center py-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6"
                >
                  <Check className="w-8 h-8 text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  Message sent successfully!
                </h3>
                <p className="text-gray-400">
                  We'll get back to you within 24 hours.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="relative space-y-6">
                {/* Name Field */}
                <motion.div variants={itemVariants} className="relative">
                  <motion.label
                    className="absolute left-6 text-gray-500 pointer-events-none origin-left"
                    animate={{
                      y: isLabelFloating('name') ? -28 : 16,
                      scale: isLabelFloating('name') ? 0.85 : 1,
                      color: focused.name
                        ? 'rgb(139, 92, 246)'
                        : 'rgb(107, 114, 128)',
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    Name
                  </motion.label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => handleFocus('name')}
                    onBlur={() => handleBlur('name')}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-transparent outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div variants={itemVariants} className="relative">
                  <motion.label
                    className="absolute left-6 text-gray-500 pointer-events-none origin-left"
                    animate={{
                      y: isLabelFloating('email') ? -28 : 16,
                      scale: isLabelFloating('email') ? 0.85 : 1,
                      color: focused.email
                        ? 'rgb(139, 92, 246)'
                        : 'rgb(107, 114, 128)',
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    Email
                  </motion.label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-transparent outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                  />
                </motion.div>

                {/* Message Field */}
                <motion.div variants={itemVariants} className="relative">
                  <motion.label
                    className="absolute left-6 text-gray-500 pointer-events-none origin-left"
                    animate={{
                      y: isLabelFloating('message') ? -28 : 16,
                      scale: isLabelFloating('message') ? 0.85 : 1,
                      color: focused.message
                        ? 'rgb(139, 92, 246)'
                        : 'rgb(107, 114, 128)',
                    }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                  >
                    Message
                  </motion.label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => handleFocus('message')}
                    onBlur={() => handleBlur('message')}
                    rows={5}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder-transparent outline-none transition-all duration-300 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
                  />
                </motion.div>

                {/* Submit Button with Magnetic Effect */}
                <motion.div variants={itemVariants}>
                  <div
                    ref={magnetic.ref}
                    onMouseMove={magnetic.handleMouseMove}
                    onMouseLeave={magnetic.handleMouseLeave}
                  >
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      animate={{
                        x: magnetic.position.x,
                        y: magnetic.position.y,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 150,
                        damping: 15,
                        mass: 0.1,
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full relative rounded-xl py-4 font-semibold text-white overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {/* Gradient background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-opacity duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Code2, BrainCircuit, BarChart3, Palette, ShieldCheck, ArrowUpRight } from 'lucide-react'

const showcases = [
  {
    title: 'AI & Machine Learning Engineering',
    category: 'High Growth Sector',
    description:
      'Map deep learning framework competencies, PyTorch vs TensorFlow models, and MLOps deployment readiness.',
    icon: BrainCircuit,
    color: 'from-violet-500 to-purple-600',
    stats: 'Avg Salary: $165k/yr',
  },
  {
    title: 'Full-Stack Software Architecture',
    category: 'Core Technology',
    description:
      'Evaluate modern web frameworks (React, Next.js, Node.js), cloud microservices, and system architecture design skills.',
    icon: Code2,
    color: 'from-fuchsia-500 to-pink-600',
    stats: 'Avg Salary: $145k/yr',
  },
  {
    title: 'Data Science & Analytics',
    category: 'Business Intelligence',
    description:
      'Master statistical modeling, SQL query optimization, predictive analytics, and executive dashboard storytelling.',
    icon: BarChart3,
    color: 'from-cyan-500 to-blue-600',
    stats: 'Avg Salary: $138k/yr',
  },
  {
    title: 'Product Design & UX Research',
    category: 'Creative Tech',
    description:
      'Analyze design systems, micro-interactions, Figma component architecture, and user test methodologies.',
    icon: Palette,
    color: 'from-emerald-500 to-teal-600',
    stats: 'Avg Salary: $130k/yr',
  },
]

export default function ShowcaseSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-50px' })

  return (
    <section id="showcase" ref={sectionRef} className="py-24 bg-[#0C0C0C] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-4">
            Domain Coverage
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Tailored Solutions for Every{' '}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Tech Discipline
            </span>
          </h2>
          <p className="text-gray-400 text-base md:text-lg">
            Explore domain-specific skill trees calibrated against top tech enterprise standards.
          </p>
        </div>

        {/* Grid Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {showcases.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative rounded-3xl p-8 bg-[#141414] border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-950/30 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-300 transition-colors flex items-center justify-between">
                    {item.title}
                    <ArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-gray-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <ShieldCheck className="w-4 h-4" /> Verified Skill Matrix
                  </span>
                  <span className="text-white font-bold">{item.stats}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

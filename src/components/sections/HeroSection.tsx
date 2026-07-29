import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Play, ShieldCheck, Zap, Target } from 'lucide-react'
import Scene3D from '../three/Scene3D'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex items-center overflow-hidden bg-[#0C0C0C]">
      {/* 3D Background Canvas */}
      <div className="absolute inset-0 z-0 opacity-70 pointer-events-none md:pointer-events-auto">
        <Scene3D className="w-full h-full" />
      </div>

      {/* Radial Gradient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-violet-600/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6 shadow-inner">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <span className="text-xs md:text-sm font-medium bg-gradient-to-r from-violet-300 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              AI-Powered Career & Skill Gap Analytics 2.0
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Architect Your <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              Future Career
            </span>{' '}
            with Precision AI
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mb-8">
            Careermate AI parses your resume, analyzes real-time industry skill gaps, 
            and constructs customized learning roadmaps tailored to unlock your high-growth job potential.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-12">
            <a
              href="#chat"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden shadow-xl shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-violet-500/40"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600" />
              <span className="relative flex items-center gap-2">
                Launch Career Analysis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            <a
              href="#dashboard"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-semibold text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white backdrop-blur-md transition-all duration-200"
            >
              <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
              Explore Dashboard
            </a>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10 w-full max-w-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">98.4%</p>
                <p className="text-xs text-gray-500">Match Accuracy</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">10x</p>
                <p className="text-xs text-gray-500">Faster Insights</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-lg font-bold text-white">50k+</p>
                <p className="text-xs text-gray-500">Careers Guided</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column Visual Graphic Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-3xl p-6 bg-gradient-to-b from-white/10 to-white/5 border border-white/15 backdrop-blur-2xl shadow-2xl shadow-violet-950/40">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-xs font-mono text-gray-400">CareerAI Engine v1.0</span>
            </div>

            {/* Simulated Live Analytics Widget */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#141414] border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-400">Target Role</p>
                  <p className="text-sm font-bold text-white">Senior AI Systems Engineer</p>
                </div>
                <span className="px-3 py-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  96% Match
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-white/5">
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-gray-400">Skill Coverage (PyTorch, LLMs, Docker)</span>
                  <span className="text-violet-400 font-bold">88%</span>
                </div>
                <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full w-[88%]" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#141414] border border-white/5 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 shrink-0" />
                <p className="text-xs text-gray-300 leading-snug">
                  <span className="font-semibold text-white">Recommended Action:</span> Complete 2 modules on Distributed GPU Training to increase salary projection by 24%.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

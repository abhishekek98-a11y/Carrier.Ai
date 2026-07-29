import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  type Variants,
} from 'framer-motion';
import {
  MessageCircle,
  Brain,
  Target,
  Sparkles,
  Users,
  CheckCircle,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StepColor {
  icon: string;        // Tailwind gradient classes for icon bg
  dot: string;         // Tailwind bg for timeline dot
  glow: string;        // CSS box-shadow glow
  text: string;        // Tailwind text color for step number
}

interface WorkflowStep {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: StepColor;
}

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

const palette: Record<string, StepColor> = {
  violet: {
    icon: 'from-violet-500 to-purple-600',
    dot: 'bg-violet-500',
    glow: '0 0 20px rgba(139,92,246,0.5), 0 0 60px rgba(139,92,246,0.15)',
    text: 'text-violet-500/10',
  },
  cyan: {
    icon: 'from-cyan-400 to-blue-500',
    dot: 'bg-cyan-400',
    glow: '0 0 20px rgba(34,211,238,0.5), 0 0 60px rgba(34,211,238,0.15)',
    text: 'text-cyan-400/10',
  },
  fuchsia: {
    icon: 'from-fuchsia-500 to-pink-500',
    dot: 'bg-fuchsia-500',
    glow: '0 0 20px rgba(217,70,239,0.5), 0 0 60px rgba(217,70,239,0.15)',
    text: 'text-fuchsia-500/10',
  },
  emerald: {
    icon: 'from-emerald-400 to-green-500',
    dot: 'bg-emerald-400',
    glow: '0 0 20px rgba(52,211,153,0.5), 0 0 60px rgba(52,211,153,0.15)',
    text: 'text-emerald-400/10',
  },
  amber: {
    icon: 'from-amber-400 to-orange-500',
    dot: 'bg-amber-400',
    glow: '0 0 20px rgba(251,191,36,0.5), 0 0 60px rgba(251,191,36,0.15)',
    text: 'text-amber-400/10',
  },
  rose: {
    icon: 'from-rose-400 to-red-500',
    dot: 'bg-rose-400',
    glow: '0 0 20px rgba(251,113,133,0.5), 0 0 60px rgba(251,113,133,0.15)',
    text: 'text-rose-400/10',
  },
};

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */

const steps: WorkflowStep[] = [
  {
    number: '01',
    title: 'User Query',
    description:
      'Customer initiates conversation through any channel — web, mobile, or API integration.',
    icon: MessageCircle,
    color: palette.violet,
  },
  {
    number: '02',
    title: 'NLP Processing',
    description:
      'Advanced natural language models parse the message, extracting entities, context, and linguistic patterns.',
    icon: Brain,
    color: palette.cyan,
  },
  {
    number: '03',
    title: 'Intent Detection',
    description:
      "AI classifies the user's intent with 99.7% accuracy using multi-layered classification models.",
    icon: Target,
    color: palette.fuchsia,
  },
  {
    number: '04',
    title: 'Response Generation',
    description:
      'Contextual responses are generated using retrieval-augmented generation from your knowledge base.',
    icon: Sparkles,
    color: palette.emerald,
  },
  {
    number: '05',
    title: 'Human Escalation',
    description:
      'Complex cases are intelligently routed to the best available agent with full conversation context.',
    icon: Users,
    color: palette.amber,
  },
  {
    number: '06',
    title: 'Resolution',
    description:
      'Issue resolved, feedback collected, and the model learns from each interaction to improve over time.',
    icon: CheckCircle,
    color: palette.rose,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  TimelineStep                                                       */
/* ------------------------------------------------------------------ */

function TimelineStep({
  step,
  index,
}: {
  step: WorkflowStep;
  index: number;
}) {
  const Icon = step.icon;
  const isLeft = index % 2 === 0; // 0-based: even = left, odd = right
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-8"
    >
      {/* ── Left column (desktop) ── */}
      <div
        className={`hidden md:block ${
          isLeft ? '' : 'order-2 md:order-none'
        }`}
      >
        {isLeft && (
          <motion.div
            variants={cardLeftVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="glass relative overflow-hidden rounded-2xl p-8 text-right"
          >
            {/* Large step number watermark */}
            <span
              className={`pointer-events-none absolute -top-4 right-4 select-none text-8xl font-black ${step.color.text}`}
            >
              {step.number}
            </span>

            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-end gap-3">
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color.icon}`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
              </div>
              <p className="leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Center dot (desktop) ── */}
      <div className="relative z-10 hidden md:flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={isInView ? { scale: 1 } : { scale: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.2,
          }}
          className="relative"
        >
          {/* Pulsing glow ring */}
          <span
            className={`absolute inset-0 rounded-full ${step.color.dot} animate-ping opacity-20`}
            style={{ width: 20, height: 20, margin: '-2px' }}
          />
          <span
            className={`relative block h-4 w-4 rounded-full ${step.color.dot}`}
            style={{ boxShadow: step.color.glow }}
          />
        </motion.div>
      </div>

      {/* ── Right column (desktop) ── */}
      <div
        className={`hidden md:block ${
          isLeft ? '' : 'order-none'
        }`}
      >
        {!isLeft && (
          <motion.div
            variants={cardRightVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="glass relative overflow-hidden rounded-2xl p-8"
          >
            <span
              className={`pointer-events-none absolute -top-4 left-4 select-none text-8xl font-black ${step.color.text}`}
            >
              {step.number}
            </span>

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color.icon}`}
                >
                  <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {step.title}
                </h3>
              </div>
              <p className="leading-relaxed text-gray-400">
                {step.description}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Mobile layout (always right-aligned) ── */}
      <div className="grid grid-cols-[auto_1fr] gap-4 md:hidden">
        {/* Mobile dot */}
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: 0.15,
            }}
            className="relative mt-8"
          >
            <span
              className={`absolute inset-0 rounded-full ${step.color.dot} animate-ping opacity-20`}
              style={{ width: 18, height: 18, margin: '-2px' }}
            />
            <span
              className={`relative block h-3.5 w-3.5 rounded-full ${step.color.dot}`}
              style={{ boxShadow: step.color.glow }}
            />
          </motion.div>
          {/* Connecting line segment for mobile */}
          {index < steps.length - 1 && (
            <div className="mt-2 w-[2px] flex-1 bg-gradient-to-b from-white/10 to-transparent" />
          )}
        </div>

        {/* Mobile card */}
        <motion.div
          variants={cardRightVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="glass relative overflow-hidden rounded-2xl p-6"
        >
          <span
            className={`pointer-events-none absolute -top-2 right-3 select-none text-7xl font-black ${step.color.text}`}
          >
            {step.number}
          </span>

          <div className="relative z-10">
            <div className="mb-3 flex items-center gap-3">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${step.color.icon}`}
              >
                <Icon className="h-4 w-4 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-lg font-semibold text-white">
                {step.title}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              {step.description}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  WorkflowSection                                                    */
/* ------------------------------------------------------------------ */

export default function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: '-80px' });

  /* Scroll-driven timeline progress */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const lineHeight = useTransform(scrollYProgress, [0.05, 0.85], ['0%', '100%']);

  return (
    <section
      id="workflow"
      ref={sectionRef}
      className="relative py-32 lg:py-48"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-[800px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/[0.03] blur-[150px]" />
        <div className="absolute left-1/4 top-3/4 h-[500px] w-[500px] rounded-full bg-violet-600/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* ── Header ── */}
        <div ref={headerRef} className="mb-24 text-center">
          <motion.p
            variants={headingVariants}
            initial="hidden"
            animate={isHeaderInView ? 'visible' : 'hidden'}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-cyan-400"
          >
            Workflow
          </motion.p>

          <motion.h2
            variants={headingVariants}
            initial="hidden"
            animate={isHeaderInView ? 'visible' : 'hidden'}
            transition={{ delay: 0.1 }}
            className="gradient-text-secondary text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            How NexusAI Processes
            <br />
            Every Query
          </motion.h2>
        </div>

        {/* ── Timeline ── */}
        <div ref={timelineRef} className="relative">
          {/* Vertical centre line (desktop) */}
          <div className="pointer-events-none absolute left-1/2 top-0 hidden h-full -translate-x-1/2 md:block">
            {/* Background track */}
            <div className="h-full w-[2px] bg-white/[0.06]" />
            {/* Animated fill */}
            <motion.div
              className="absolute left-0 top-0 w-[2px]"
              style={{
                height: lineHeight,
                background:
                  'linear-gradient(to bottom, #8b5cf6, #a855f7, #22d3ee)',
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-12 md:gap-16">
            {steps.map((step, i) => (
              <TimelineStep key={step.number} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

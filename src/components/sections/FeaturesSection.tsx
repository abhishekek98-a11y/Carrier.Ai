import { useRef, useState, type MouseEvent } from 'react';
import {
  motion,
  useInView,
  type Variants,
} from 'framer-motion';
import {
  Brain,
  Zap,
  MessageSquare,
  Tag,
  Users,
  BarChart3,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface FeatureColor {
  icon: string;       // Tailwind gradient for the icon circle
  glow: string;       // CSS box-shadow on hover
  border: string;     // conic-gradient accent for animated border
  ring: string;       // subtle ring color for border highlight
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  color: FeatureColor;
}

/* ------------------------------------------------------------------ */
/*  Color palette per feature                                          */
/* ------------------------------------------------------------------ */

const palette: Record<string, FeatureColor> = {
  violet: {
    icon: 'from-violet-500 to-purple-600',
    glow: '0 0 30px rgba(139,92,246,0.25), 0 0 80px rgba(139,92,246,0.08)',
    border: 'conic-gradient(from 0deg, #8b5cf6, #a855f7, #8b5cf6)',
    ring: 'rgba(139,92,246,0.35)',
  },
  cyan: {
    icon: 'from-cyan-400 to-blue-500',
    glow: '0 0 30px rgba(34,211,238,0.25), 0 0 80px rgba(34,211,238,0.08)',
    border: 'conic-gradient(from 0deg, #22d3ee, #3b82f6, #22d3ee)',
    ring: 'rgba(34,211,238,0.35)',
  },
  fuchsia: {
    icon: 'from-fuchsia-500 to-pink-500',
    glow: '0 0 30px rgba(217,70,239,0.25), 0 0 80px rgba(217,70,239,0.08)',
    border: 'conic-gradient(from 0deg, #d946ef, #ec4899, #d946ef)',
    ring: 'rgba(217,70,239,0.35)',
  },
  emerald: {
    icon: 'from-emerald-400 to-green-500',
    glow: '0 0 30px rgba(52,211,153,0.25), 0 0 80px rgba(52,211,153,0.08)',
    border: 'conic-gradient(from 0deg, #34d399, #22c55e, #34d399)',
    ring: 'rgba(52,211,153,0.35)',
  },
  amber: {
    icon: 'from-amber-400 to-orange-500',
    glow: '0 0 30px rgba(251,191,36,0.25), 0 0 80px rgba(251,191,36,0.08)',
    border: 'conic-gradient(from 0deg, #fbbf24, #f97316, #fbbf24)',
    ring: 'rgba(251,191,36,0.35)',
  },
  rose: {
    icon: 'from-rose-400 to-red-500',
    glow: '0 0 30px rgba(251,113,133,0.25), 0 0 80px rgba(251,113,133,0.08)',
    border: 'conic-gradient(from 0deg, #fb7185, #ef4444, #fb7185)',
    ring: 'rgba(251,113,133,0.35)',
  },
};

/* ------------------------------------------------------------------ */
/*  Feature data                                                       */
/* ------------------------------------------------------------------ */

const features: Feature[] = [
  {
    icon: Brain,
    title: 'Smart NLP Understanding',
    description:
      'Advanced natural language processing that understands context, sentiment, and intent with human-like comprehension.',
    color: palette.violet,
  },
  {
    icon: Zap,
    title: 'Instant Response Generation',
    description:
      'Generate accurate, contextual responses in milliseconds using advanced language models.',
    color: palette.cyan,
  },
  {
    icon: MessageSquare,
    title: 'FAQ Automation',
    description:
      'Automatically detect and resolve frequently asked questions with intelligent pattern matching.',
    color: palette.fuchsia,
  },
  {
    icon: Tag,
    title: 'Ticket Creation',
    description:
      'Seamlessly create, categorize, and route support tickets when AI resolution is not sufficient.',
    color: palette.emerald,
  },
  {
    icon: Users,
    title: 'Human Escalation',
    description:
      'Intelligent handoff to human agents with full conversation context and sentiment analysis.',
    color: palette.amber,
  },
  {
    icon: BarChart3,
    title: 'Chat Analytics',
    description:
      'Real-time analytics dashboard with insights on resolution rates, sentiment trends, and agent performance.',
    color: palette.rose,
  },
];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ------------------------------------------------------------------ */
/*  FeatureCard                                                        */
/* ------------------------------------------------------------------ */

function FeatureCard({ feature }: { feature: Feature }) {
  const Icon = feature.icon;
  const { color } = feature;

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;   // max ±10°
    const rotateY = ((x - centerX) / centerX) * 10;    // max ±10°
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div variants={cardVariants} className="perspective-[1000px]">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{
          transformStyle: 'preserve-3d',
          boxShadow: isHovered ? color.glow : 'none',
        }}
        className="relative rounded-2xl will-change-transform"
      >
        {/* ── Animated gradient border ── */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl transition-opacity duration-500"
          style={{
            background: color.border,
            opacity: isHovered ? 0.55 : 0,
            zIndex: 0,
          }}
        />

        {/* ── Card body ── */}
        <div className="glass glass-hover relative z-10 rounded-2xl p-8">
          {/* Icon */}
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${color.icon}`}
          >
            <Icon className="h-5 w-5 text-white" strokeWidth={2} />
          </div>

          {/* Title */}
          <h3 className="mt-6 text-xl font-semibold text-white">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="mt-3 leading-relaxed text-gray-400">
            {feature.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  FeaturesSection                                                    */
/* ------------------------------------------------------------------ */

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-32 lg:py-48"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-600/[0.04] blur-[120px]" />
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl px-6"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ── Header ── */}
        <div className="mb-20 text-center">
          <motion.p
            variants={headingVariants}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-violet-400"
          >
            Capabilities
          </motion.p>

          <motion.h2
            variants={headingVariants}
            className="gradient-text-primary text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Powerful Features for
            <br />
            Modern Support
          </motion.h2>

          <motion.p
            variants={headingVariants}
            className="mx-auto mt-6 max-w-2xl text-xl text-gray-400"
          >
            Every feature designed to enhance customer experience and streamline
            support operations.
          </motion.p>
        </div>

        {/* ── Feature grid ── */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

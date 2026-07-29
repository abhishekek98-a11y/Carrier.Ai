import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

/* ─── Character-level scroll reveal ─── */

function ScrollRevealChar({
  char,
  index,
  total,
  scrollYProgress,
}: {
  char: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  // Each character maps to a narrow scroll slice so they reveal sequentially
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {char === ' ' ? '\u00A0' : char}
    </motion.span>
  );
}

function ScrollRevealHeading({ text }: { text: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.9', 'start 0.25'],
  });

  const chars = text.split('');

  return (
    <div ref={containerRef}>
      <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
        {chars.map((char, i) => (
          <ScrollRevealChar
            key={`${char}-${i}`}
            char={char}
            index={i}
            total={chars.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </h2>
    </div>
  );
}

/* ─── Stat card ─── */

interface StatCardProps {
  value: string;
  label: string;
  index: number;
}

const cardVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      delay: i * 0.15,
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

function StatCard({ value, label, index }: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      className="glass glass-hover rounded-2xl p-8 text-center md:text-left"
    >
      <p className="text-4xl md:text-5xl font-bold gradient-text-primary mb-2">
        {value}
      </p>
      <p className="text-gray-400 text-sm uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

/* ─── Stats ─── */

const stats = [
  { value: '99.7%', label: 'Accuracy Rate' },
  { value: '<0.3s', label: 'Response Time' },
  { value: '24/7', label: 'Availability' },
];

/* ─── Main section ─── */

export default function AboutSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-100px' });

  return (
    <section id="about" className="relative py-32 md:py-48 overflow-hidden">
      {/* ── Decorative background elements ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Gradient orb - top right */}
        <div
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full
            bg-gradient-to-br from-violet-500/[0.07] via-purple-500/[0.04] to-transparent
            blur-3xl"
        />
        {/* Gradient line - left */}
        <div
          className="absolute top-1/3 -left-20 w-[400px] h-px
            bg-gradient-to-r from-transparent via-violet-500/20 to-transparent
            rotate-[25deg]"
        />
        {/* Gradient line - right */}
        <div
          className="absolute bottom-1/4 -right-20 w-[350px] h-px
            bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent
            -rotate-[15deg]"
        />
        {/* Small orb accent */}
        <div
          className="absolute bottom-20 left-1/4 w-64 h-64 rounded-full
            bg-gradient-to-tr from-cyan-400/[0.05] to-transparent blur-3xl"
        />
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 lg:gap-24 items-start">
          {/* Left column – text (3/5 width) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Label */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm uppercase tracking-widest text-violet-400"
            >
              About the System
            </motion.p>

            {/* Character-by-character scroll reveal heading */}
            <ScrollRevealHeading text="Intelligent Support Powered by Advanced NLP" />

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1] as const,
              }}
              className="text-xl text-gray-400 max-w-3xl leading-relaxed"
            >
              Our AI-powered chatbot leverages state-of-the-art Natural Language
              Processing to understand customer intent, generate contextual
              responses, and seamlessly escalate complex issues — delivering 24/7
              support that feels genuinely human.
            </motion.p>
          </div>

          {/* Right column – stat cards (2/5 width) */}
          <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? 'visible' : 'hidden'}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            {stats.map((stat, i) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                index={i}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

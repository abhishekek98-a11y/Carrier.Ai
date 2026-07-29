import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const companies = [
  { name: 'Google', style: 'font-bold tracking-tight' },
  { name: 'Microsoft', style: 'font-semibold tracking-wide' },
  { name: 'Stripe', style: 'font-bold italic' },
  { name: 'Shopify', style: 'font-black tracking-tight' },
  { name: 'Slack', style: 'font-bold tracking-wider' },
  { name: 'Notion', style: 'font-semibold tracking-widest' },
  { name: 'Linear', style: 'font-medium tracking-[0.2em]' },
  { name: 'Vercel', style: 'font-bold tracking-tight' },
  { name: 'Netflix', style: 'font-black italic' },
  { name: 'Spotify', style: 'font-semibold tracking-wide' },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

function LogoCard({ name, style }: { name: string; style: string }) {
  return (
    <div
      className={`
        glass rounded-xl px-8 py-4 flex-shrink-0
        transition-all duration-500 ease-out cursor-default
        hover:bg-white/[0.06] hover:border-white/[0.15]
        hover:shadow-[0_0_30px_rgba(139,92,246,0.12),0_0_60px_rgba(139,92,246,0.04)]
      `}
    >
      <span
        className={`text-lg text-gray-400 ${style} select-none whitespace-nowrap
          transition-colors duration-500 hover:text-gray-200`}
      >
        {name}
      </span>
    </div>
  );
}

export default function TrustedBySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <motion.section
      ref={sectionRef}
      className="relative py-24 overflow-hidden"
      variants={sectionVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      {/* Section heading */}
      <p className="text-sm uppercase tracking-[0.3em] text-gray-500 text-center mb-12">
        Trusted by Industry Leaders
      </p>

      {/* Marquee container */}
      <div className="relative">
        {/* Left gradient fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 z-10
            pointer-events-none
            bg-gradient-to-r from-[#0C0C0C] to-transparent"
        />

        {/* Right gradient fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-32 z-10
            pointer-events-none
            bg-gradient-to-l from-[#0C0C0C] to-transparent"
        />

        {/* Scrolling track */}
        <div className="flex animate-marquee w-max gap-6">
          {/* First set */}
          {companies.map((company) => (
            <LogoCard
              key={`first-${company.name}`}
              name={company.name}
              style={company.style}
            />
          ))}

          {/* Duplicate set for seamless loop */}
          {companies.map((company) => (
            <LogoCard
              key={`second-${company.name}`}
              name={company.name}
              style={company.style}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  motion,
  useInView,
  type Variants,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion';
import {
  Users,
  MessageSquare,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface StatColor {
  icon: string;
  glow: string;
  ring: string;
  badge: string;
  dot: string;
}

interface StatCard {
  icon: LucideIcon;
  label: string;
  value: number;
  suffix?: string;
  decimals?: number;
  change: number;
  color: StatColor;
}

/* ------------------------------------------------------------------ */
/*  Color palette                                                      */
/* ------------------------------------------------------------------ */

const palette: Record<string, StatColor> = {
  violet: {
    icon: 'from-violet-500 to-purple-600',
    glow: '0 0 30px rgba(139,92,246,0.2), 0 0 80px rgba(139,92,246,0.06)',
    ring: 'rgba(139,92,246,0.35)',
    badge: 'bg-violet-500/10 text-violet-400',
    dot: '#8b5cf6',
  },
  cyan: {
    icon: 'from-cyan-400 to-blue-500',
    glow: '0 0 30px rgba(34,211,238,0.2), 0 0 80px rgba(34,211,238,0.06)',
    ring: 'rgba(34,211,238,0.35)',
    badge: 'bg-cyan-500/10 text-cyan-400',
    dot: '#22d3ee',
  },
  fuchsia: {
    icon: 'from-fuchsia-500 to-pink-500',
    glow: '0 0 30px rgba(217,70,239,0.2), 0 0 80px rgba(217,70,239,0.06)',
    ring: 'rgba(217,70,239,0.35)',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400',
    dot: '#d946ef',
  },
  emerald: {
    icon: 'from-emerald-400 to-green-500',
    glow: '0 0 30px rgba(52,211,153,0.2), 0 0 80px rgba(52,211,153,0.06)',
    ring: 'rgba(52,211,153,0.35)',
    badge: 'bg-emerald-500/10 text-emerald-400',
    dot: '#34d399',
  },
};

/* ------------------------------------------------------------------ */
/*  Stat data                                                          */
/* ------------------------------------------------------------------ */

const stats: StatCard[] = [
  {
    icon: Users,
    label: 'Active Users',
    value: 2847,
    change: 12.5,
    color: palette.violet,
  },
  {
    icon: MessageSquare,
    label: 'Total Chats',
    value: 48392,
    change: 23.1,
    color: palette.cyan,
  },
  {
    icon: Tag,
    label: 'Tickets Generated',
    value: 1284,
    change: -8.3,
    color: palette.fuchsia,
  },
  {
    icon: TrendingUp,
    label: 'Resolution Rate',
    value: 94.7,
    suffix: '%',
    decimals: 1,
    change: 5.2,
    color: palette.emerald,
  },
];

/* ------------------------------------------------------------------ */
/*  Chart data                                                         */
/* ------------------------------------------------------------------ */

const chartData = [32, 68, 45, 82, 56, 91, 73];
const chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ------------------------------------------------------------------ */
/*  Animation variants                                                 */
/* ------------------------------------------------------------------ */

const sectionVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp: Variants = {
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

const chartContainerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 },
  },
};

/* ------------------------------------------------------------------ */
/*  AnimatedCounter – counts up from 0 using rAF                       */
/* ------------------------------------------------------------------ */

function AnimatedCounter({
  target,
  decimals = 0,
  suffix = '',
  shouldAnimate,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  shouldAnimate: boolean;
}) {
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (latest) => {
    if (decimals > 0) return latest.toFixed(decimals);
    return Math.round(latest).toLocaleString();
  });
  const [display, setDisplay] = useState(decimals > 0 ? '0.0' : '0');

  useEffect(() => {
    const unsub = rounded.on('change', (v) => setDisplay(v));
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (!shouldAnimate) return;
    const controls = animate(motionVal, target, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1] as const,
    });
    return controls.stop;
  }, [shouldAnimate, target, motionVal]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  StatCardItem                                                       */
/* ------------------------------------------------------------------ */

function StatCardItem({
  stat,
  shouldAnimate,
}: {
  stat: StatCard;
  shouldAnimate: boolean;
}) {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;

  return (
    <motion.div variants={cardVariants} className="group">
      <div
        className="glass glass-hover relative rounded-2xl p-6 transition-shadow duration-500"
        style={{
          boxShadow: 'none',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = stat.color.glow;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
        }}
      >
        {/* Icon */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color.icon}`}
        >
          <Icon className="h-6 w-6 text-white" strokeWidth={2} />
        </div>

        {/* Value */}
        <div className="mt-5 text-3xl font-bold tracking-tight text-white lg:text-4xl">
          <AnimatedCounter
            target={stat.value}
            decimals={stat.decimals}
            suffix={stat.suffix}
            shouldAnimate={shouldAnimate}
          />
        </div>

        {/* Label */}
        <p className="mt-1 text-sm text-gray-400">{stat.label}</p>

        {/* Change badge */}
        <div className="mt-4 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isPositive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-red-500/10 text-red-400'
            }`}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(stat.change)}%
          </span>
          <span className="text-xs text-gray-500">vs last week</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  AnimatedLineChart                                                   */
/* ------------------------------------------------------------------ */

function AnimatedLineChart({ shouldAnimate }: { shouldAnimate: boolean }) {
  const svgWidth = 800;
  const svgHeight = 320;
  const paddingX = 60;
  const paddingTop = 40;
  const paddingBottom = 50;

  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingTop - paddingBottom;

  const maxVal = Math.max(...chartData);
  const minVal = Math.min(...chartData) * 0.6;

  // Build points
  const points = chartData.map((val, i) => ({
    x: paddingX + (i / (chartData.length - 1)) * chartW,
    y: paddingTop + chartH - ((val - minVal) / (maxVal - minVal)) * chartH,
  }));

  // Smooth curve through points using cubic Bézier
  const buildPath = useCallback(() => {
    if (points.length < 2) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[Math.max(0, i - 1)];
      const p1 = points[i];
      const p2 = points[i + 1];
      const p3 = points[Math.min(points.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  }, [points]);

  const pathD = buildPath();

  // Build area path (fill below line)
  const areaD = `${pathD} L ${points[points.length - 1].x} ${
    paddingTop + chartH
  } L ${points[0].x} ${paddingTop + chartH} Z`;

  // Grid lines
  const gridLines = 5;
  const gridYs = Array.from(
    { length: gridLines },
    (_, i) => paddingTop + (i / (gridLines - 1)) * chartH
  );

  // Estimate path length for stroke animation
  const pathLength = 1200;

  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Line gradient */}
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
        {/* Area gradient */}
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        {/* Glow filter */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Grid lines */}
      {gridYs.map((y, i) => (
        <line
          key={i}
          x1={paddingX}
          y1={y}
          x2={svgWidth - paddingX}
          y2={y}
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="1"
        />
      ))}

      {/* Vertical grid lines */}
      {points.map((p, i) => (
        <line
          key={`v-${i}`}
          x1={p.x}
          y1={paddingTop}
          x2={p.x}
          y2={paddingTop + chartH}
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      ))}

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill="url(#areaGradient)"
        initial={{ opacity: 0 }}
        animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />

      {/* Line glow */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
        animate={
          shouldAnimate
            ? { strokeDashoffset: 0 }
            : { strokeDashoffset: pathLength }
        }
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
      />

      {/* Main line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ strokeDasharray: pathLength, strokeDashoffset: pathLength }}
        animate={
          shouldAnimate
            ? { strokeDashoffset: 0 }
            : { strokeDashoffset: pathLength }
        }
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] as const, delay: 0.5 }}
      />

      {/* Animated dots on peaks */}
      {points.map((p, i) => (
        <motion.g key={i}>
          {/* Outer pulse ring */}
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={8}
            fill="none"
            stroke={i % 2 === 0 ? '#8b5cf6' : '#22d3ee'}
            strokeWidth="1"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              shouldAnimate
                ? { opacity: [0, 0.4, 0], scale: [0.5, 1.5, 2] }
                : { opacity: 0 }
            }
            transition={{
              delay: 0.5 + (i / points.length) * 2 + 0.5,
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
          {/* Dot */}
          <motion.circle
            cx={p.x}
            cy={p.y}
            r={4}
            fill={i % 2 === 0 ? '#8b5cf6' : '#22d3ee'}
            stroke="#0C0C0C"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              shouldAnimate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }
            }
            transition={{
              delay: 0.5 + (i / points.length) * 2,
              duration: 0.4,
              ease: [0.16, 1, 0.3, 1] as const,
            }}
          />
        </motion.g>
      ))}

      {/* X-axis labels */}
      {chartLabels.map((label, i) => (
        <motion.text
          key={label}
          x={points[i].x}
          y={svgHeight - 12}
          textAnchor="middle"
          fill="rgba(156,163,175,0.6)"
          fontSize="12"
          fontFamily="Inter, system-ui, sans-serif"
          initial={{ opacity: 0 }}
          animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
        >
          {label}
        </motion.text>
      ))}

      {/* Y-axis labels */}
      {gridYs.map((y, i) => {
        const val = Math.round(
          minVal + ((gridLines - 1 - i) / (gridLines - 1)) * (maxVal - minVal)
        );
        return (
          <motion.text
            key={`y-${i}`}
            x={paddingX - 12}
            y={y + 4}
            textAnchor="end"
            fill="rgba(156,163,175,0.4)"
            fontSize="11"
            fontFamily="Inter, system-ui, sans-serif"
            initial={{ opacity: 0 }}
            animate={shouldAnimate ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.5 }}
          >
            {val}
          </motion.text>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  DashboardSection                                                   */
/* ------------------------------------------------------------------ */

export default function DashboardSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

  return (
    <section
      id="dashboard"
      ref={sectionRef}
      className="relative py-32 lg:py-48"
    >
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[700px] rounded-full bg-fuchsia-600/[0.03] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[600px] rounded-full bg-violet-600/[0.03] blur-[120px]" />
      </div>

      <motion.div
        className="relative mx-auto max-w-7xl px-6"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        {/* ── Header ── */}
        <div className="mb-16 text-center lg:mb-20">
          <motion.p
            variants={fadeUp}
            className="mb-4 text-sm font-medium uppercase tracking-widest text-fuchsia-400"
          >
            Analytics
          </motion.p>

          <motion.h2
            variants={fadeUp}
            className="gradient-text-primary text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Real-Time Intelligence
            <br />
            Dashboard
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-400 lg:text-xl"
          >
            Monitor every conversation, track resolution metrics, and uncover
            actionable insights — all from a single intelligent command center.
          </motion.p>
        </div>

        {/* ── Stat cards grid ── */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6"
        >
          {stats.map((stat) => (
            <StatCardItem
              key={stat.label}
              stat={stat}
              shouldAnimate={isInView}
            />
          ))}
        </motion.div>

        {/* ── Chart area ── */}
        <motion.div variants={chartContainerVariants} className="mt-10 lg:mt-14">
          <div className="glass rounded-2xl p-4 lg:p-8">
            {/* Chart header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Conversation Volume
                </h3>
                <p className="text-sm text-gray-500">
                  Weekly overview of support interactions
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  <span className="text-xs text-gray-400">Conversations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span className="text-xs text-gray-400">Resolved</span>
                </div>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="aspect-[2.5/1] w-full">
              <AnimatedLineChart shouldAnimate={isInView} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

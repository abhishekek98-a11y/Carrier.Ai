import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Bot, Send, Sparkles, User } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Message {
  id: number;
  role: 'user' | 'ai';
  content: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    role: 'ai',
    content: "Hello! I'm your AI assistant. How can I help you today?",
  },
];

const SUGGESTED_PROMPTS = [
  'What are your pricing plans?',
  'I need help with billing',
  'How do I reset my password?',
] as const;

const AI_RESPONSES: Record<string, string> = {
  'What are your pricing plans?':
    'We offer three flexible plans: **Starter** at $29/mo for small teams, **Professional** at $99/mo with advanced analytics, and **Enterprise** with custom pricing. All plans include unlimited conversations and 24/7 support.',
  'I need help with billing':
    'I can help with billing! You can manage your subscription, update payment methods, and view invoices from your dashboard under Settings → Billing. Would you like me to guide you through any specific billing task?',
  'How do I reset my password?':
    'To reset your password: 1) Click "Forgot Password" on the login page, 2) Enter your registered email, 3) Check your inbox for a reset link, 4) Create a new secure password. The link expires in 24 hours. Need more help?',
};

const DEFAULT_AI_RESPONSE =
  "Thanks for your message! I'm here to help. Could you provide more details so I can assist you better?";

// ─── Animation Variants ─────────────────────────────────────────────────────

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const fadeSlideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const chatWindowVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 },
  },
};

const messageVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

// ─── Sub-components ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div
      variants={messageVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-start gap-3"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center">
        <Bot className="w-4 h-4 text-white" />
      </div>
      {/* Dots */}
      <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 rounded-full bg-gray-400"
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AIMessage({ content }: { content: string }) {
  // Render markdown-like bold (**text**) and numbered lists
  const rendered = content.split('**').map((segment, idx) =>
    idx % 2 === 1 ? (
      <span key={idx} className="font-semibold text-white">
        {segment}
      </span>
    ) : (
      <span key={idx}>{segment}</span>
    )
  );

  return (
    <motion.div
      variants={messageVariant}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
        <Bot className="w-4 h-4 text-white" />
      </div>
      {/* Bubble */}
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-sm bg-white/[0.06] border border-white/[0.08] backdrop-blur-sm text-sm text-gray-300 leading-relaxed">
        {rendered}
      </div>
    </motion.div>
  );
}

function UserMessage({ content }: { content: string }) {
  return (
    <motion.div
      variants={messageVariant}
      initial="hidden"
      animate="visible"
      className="flex items-start gap-3 justify-end"
    >
      {/* Bubble */}
      <div className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-r from-violet-600 to-purple-600 text-sm text-white leading-relaxed shadow-lg shadow-violet-500/20">
        {content}
      </div>
      {/* User Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
        <User className="w-4 h-4 text-white" />
      </div>
    </motion.div>
  );
}

// ─── Floating Decorative Elements ────────────────────────────────────────────

function FloatingElements() {
  return (
    <>
      {/* Top-right glow */}
      <motion.div
        className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-violet-500/10 blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Bottom-left glow */}
      <motion.div
        className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none"
        animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.45, 0.25] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      />
      {/* Sparkle icon floating */}
      <motion.div
        className="absolute -top-6 right-12 text-violet-400/30 pointer-events-none"
        animate={{ y: [0, -10, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.div>
      {/* Small floating orb */}
      <motion.div
        className="absolute bottom-12 -right-4 w-3 h-3 rounded-full bg-cyan-400/40 pointer-events-none"
        animate={{ y: [0, -16, 0], x: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      />
      {/* Another small orb */}
      <motion.div
        className="absolute top-1/3 -left-6 w-2 h-2 rounded-full bg-fuchsia-400/30 pointer-events-none"
        animate={{ y: [0, -12, 0], x: [0, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ChatDemoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [nextId, setNextId] = useState(2);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateChat = useCallback(
    (userMessage: string) => {
      if (isTyping) return;

      // 1. Add user message
      const userId = nextId;
      setNextId((prev) => prev + 2);
      setMessages((prev) => [
        ...prev,
        { id: userId, role: 'user', content: userMessage },
      ]);
      setInputValue('');

      // 2. Show typing indicator
      setIsTyping(true);

      // 3. After delay, add AI response
      setTimeout(() => {
        const aiResponse = AI_RESPONSES[userMessage] ?? DEFAULT_AI_RESPONSE;
        setMessages((prev) => [
          ...prev,
          { id: userId + 1, role: 'ai', content: aiResponse },
        ]);
        setIsTyping(false);
      }, 1500);
    },
    [isTyping, nextId]
  );

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    simulateChat(trimmed);
  }, [inputValue, simulateChat]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') handleSend();
    },
    [handleSend]
  );

  return (
    <section
      id="demo"
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-violet-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6"
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* ── Left: Text Content ─────────────────────────────────────── */}
          <div className="space-y-8">
            <motion.div variants={fadeSlideUp}>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-cyan-400 mb-4">
                Live Demo
              </span>
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                Experience AI{' '}
                <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent">
                  Support
                </span>{' '}
                in Action
              </h2>
            </motion.div>

            <motion.p
              variants={fadeSlideUp}
              className="text-lg text-gray-400 leading-relaxed max-w-lg"
            >
              See how NexusAI handles real customer inquiries with
              lightning-fast, context-aware responses. Click a suggested prompt
              or type your own message to interact with our AI assistant.
            </motion.p>

            {/* Suggested Prompts */}
            <motion.div variants={fadeSlideUp} className="space-y-3">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium">
                Try a prompt
              </p>
              <div className="flex flex-wrap gap-3">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <motion.button
                    key={prompt}
                    onClick={() => simulateChat(prompt)}
                    disabled={isTyping}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2.5 rounded-xl text-sm text-gray-300 bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm
                               hover:bg-white/[0.1] hover:border-white/[0.15] hover:text-white
                               transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed
                               cursor-pointer"
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* ── Right: Chat Interface ──────────────────────────────────── */}
          <motion.div variants={chatWindowVariant} className="relative">
            <FloatingElements />

            {/* Chat Window */}
            <div
              className="relative rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-xl
                          shadow-2xl shadow-violet-500/[0.06] overflow-hidden"
            >
              {/* ── Title Bar ──────────────────────────────────────────── */}
              <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 flex items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-300">
                    NexusAI Assistant
                  </span>
                </div>
                {/* Spacer to center title */}
                <div className="w-[52px]" />
              </div>

              {/* ── Messages Area ──────────────────────────────────────── */}
              <div className="h-[420px] overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
                <AnimatePresence mode="popLayout">
                  {messages.map((msg) =>
                    msg.role === 'ai' ? (
                      <AIMessage key={msg.id} content={msg.content} />
                    ) : (
                      <UserMessage key={msg.id} content={msg.content} />
                    )
                  )}
                  {isTyping && <TypingIndicator key="typing" />}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input Bar ──────────────────────────────────────────── */}
              <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] backdrop-blur-sm">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    disabled={isTyping}
                    className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none disabled:opacity-50"
                  />
                  <motion.button
                    onClick={handleSend}
                    disabled={isTyping || !inputValue.trim()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg
                               bg-gradient-to-r from-violet-500 to-fuchsia-500
                               text-white shadow-lg shadow-violet-500/25
                               disabled:opacity-30 disabled:cursor-not-allowed
                               transition-opacity duration-200 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Subtle glow behind the card */}
            <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-500/10 blur-2xl scale-105 pointer-events-none" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

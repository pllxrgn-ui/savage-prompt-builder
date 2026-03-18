"use client";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence, type Variants } from "framer-motion";

// Stagger children container
export function StaggerContainer({
  children,
  className,
  stagger = 0.04,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Fade-up item (use inside StaggerContainer)
export function FadeUpItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 12 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
      }}
    >
      {children}
    </motion.div>
  );
}

// Page wrapper with fade transition
export function PageTransition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Panel switcher with cross-fade
export function AnimatedPanel({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        className={className}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Scale-on-hover card wrapper
export function HoverCard({
  children,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "button";
}) {
  const Component = as === "button" ? motion.button : motion.div;
  return (
    <Component
      className={className}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </Component>
  );
}

// Collapsible section with smooth height animation
export function CollapsibleContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Shimmer border glow effect
export function ShimmerBorder({
  children,
  className,
  active = false,
}: {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {active && (
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, transparent, var(--color-accent), transparent)",
            opacity: 0.15,
            filter: "blur(8px)",
          }}
          animate={{
            backgroundPosition: ["0% 50%", "200% 50%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
      {children}
    </div>
  );
}

// Pulse dot for active states
export function PulseDot({ className }: { className?: string }) {
  return (
    <motion.span
      className={`inline-block w-2 h-2 rounded-full bg-accent ${className ?? ""}`}
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// Route-level page transition — wrap {children} in (app)/layout.tsx
export function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

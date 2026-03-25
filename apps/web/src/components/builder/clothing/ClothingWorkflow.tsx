"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CLOTHING_WORKFLOW } from "@/lib/workflows";
import type { WorkflowPhaseId } from "@/lib/workflows";
import { DesignPhase } from "./DesignPhase";
import { GarmentPhase } from "./GarmentPhase";
import { PrintMethodPhase } from "./PrintMethodPhase";
import { LookFeelPhase } from "./LookFeelPhase";
import { FinalTouchesPhase } from "./FinalTouchesPhase";

interface ClothingWorkflowProps {
  activePhaseId: WorkflowPhaseId;
}

const PHASE_COMPONENTS: Record<string, React.ComponentType> = {
  design: DesignPhase,
  garment: GarmentPhase,
  "print-method": PrintMethodPhase,
  "look-feel": LookFeelPhase,
  "final-touches": FinalTouchesPhase,
};

export function ClothingWorkflow({ activePhaseId }: ClothingWorkflowProps) {
  const PhaseComponent = PHASE_COMPONENTS[activePhaseId];

  if (!PhaseComponent) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activePhaseId}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        <PhaseComponent />
      </motion.div>
    </AnimatePresence>
  );
}

export { CLOTHING_WORKFLOW };

import type { ComponentType } from "react";

export type WorkflowPhaseId = string;

export interface WorkflowPhase {
  id: WorkflowPhaseId;
  label: string;
  description: string;
  icon: string;
}

export interface WorkflowDefinition {
  id: string;
  templateId: string;
  phases: WorkflowPhase[];
}

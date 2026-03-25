export type { WorkflowDefinition, WorkflowPhase, WorkflowPhaseId } from "./types";
export { GENERIC_WORKFLOW } from "./generic-workflow";
export { CLOTHING_WORKFLOW } from "./clothing-workflow";

import type { WorkflowDefinition } from "./types";
import { GENERIC_WORKFLOW } from "./generic-workflow";
import { CLOTHING_WORKFLOW } from "./clothing-workflow";

const CUSTOM_WORKFLOWS: Record<string, WorkflowDefinition> = {
  clothing: CLOTHING_WORKFLOW,
};

/**
 * Returns the custom workflow for a template, or the generic workflow.
 */
export function getWorkflowForTemplate(templateId: string): WorkflowDefinition {
  return CUSTOM_WORKFLOWS[templateId] ?? GENERIC_WORKFLOW;
}

/**
 * Check whether a template has a custom workflow.
 */
export function hasCustomWorkflow(templateId: string): boolean {
  return templateId in CUSTOM_WORKFLOWS;
}

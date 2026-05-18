import { Injectable, computed, signal } from '@angular/core';

import { INITIAL_STEPS, TALKING_POINTS } from '../data/interview-flow.data';
import { InterviewStep } from '../models/interview-step.model';

/**
 * Manages interview flow state and business logic.
 *
 * In an interview, you would explain:
 * - This service is a singleton (@Injectable with providedIn: 'root')
 * - It centralizes state logic away from components
 * - Components inject it and call methods to update state
 * - This follows single responsibility and makes testing easier
 */
@Injectable({
  providedIn: 'root',
})
export class InterviewService {
  private readonly steps = signal<InterviewStep[]>(this.cloneSteps(INITIAL_STEPS));
  private readonly activeStepId = signal(INITIAL_STEPS[0].id);

  readonly stepsView = this.steps.asReadonly();
  readonly activeStepIdView = this.activeStepId.asReadonly();
  readonly talkingPointsView = TALKING_POINTS;

  readonly activeStep = computed(() => {
    return this.steps().find((step) => step.id === this.activeStepId()) ?? this.steps()[0];
  });

  readonly completedCount = computed(() => {
    return this.steps().filter((step) => step.done).length;
  });

  readonly progress = computed(() => {
    return Math.round((this.completedCount() / this.steps().length) * 100);
  });

  selectStep(stepId: number): void {
    this.activeStepId.set(stepId);
  }

  toggleStepDone(stepId: number): void {
    this.steps.update((steps) =>
      steps.map((step) => (step.id === stepId ? { ...step, done: !step.done } : step)),
    );
  }

  nextStep(): void {
    const currentSteps = this.steps();
    const currentIndex = currentSteps.findIndex((step) => step.id === this.activeStepId());
    const nextStep = currentSteps[(currentIndex + 1) % currentSteps.length];

    this.activeStepId.set(nextStep.id);
  }

  resetFlow(): void {
    this.steps.set(this.cloneSteps(INITIAL_STEPS));
    this.activeStepId.set(INITIAL_STEPS[0].id);
  }

  private cloneSteps(steps: InterviewStep[]): InterviewStep[] {
    return steps.map((step) => ({ ...step }));
  }
}

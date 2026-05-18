import { Injectable, computed, effect, signal } from '@angular/core';

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
  private static readonly STORAGE_KEY = 'angular-interview.flow.v1';

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

  constructor() {
    this.hydrateFromStorage();

    effect(() => {
      this.persistToStorage(this.steps(), this.activeStepId());
    });
  }

  selectStep(stepId: number): void {
    if (!this.steps().some((step) => step.id === stepId)) {
      return;
    }

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
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextStep = currentSteps[(safeCurrentIndex + 1) % currentSteps.length];

    this.activeStepId.set(nextStep.id);
  }

  resetFlow(): void {
    this.steps.set(this.cloneSteps(INITIAL_STEPS));
    this.activeStepId.set(INITIAL_STEPS[0].id);
  }

  private cloneSteps(steps: InterviewStep[]): InterviewStep[] {
    return steps.map((step) => ({ ...step }));
  }

  private hydrateFromStorage(): void {
    const storage = this.getBrowserStorage();
    if (!storage) {
      return;
    }

    const rawValue = storage.getItem(InterviewService.STORAGE_KEY);
    if (!rawValue) {
      return;
    }

    try {
      const parsed = JSON.parse(rawValue) as unknown;
      const restoredState = this.normalizePersistedState(parsed);
      if (!restoredState) {
        return;
      }

      this.steps.set(restoredState.steps);
      this.activeStepId.set(restoredState.activeStepId);
    } catch {
      storage.removeItem(InterviewService.STORAGE_KEY);
    }
  }

  private persistToStorage(steps: InterviewStep[], activeStepId: number): void {
    const storage = this.getBrowserStorage();
    if (!storage) {
      return;
    }

    const payload = JSON.stringify({ steps, activeStepId });
    storage.setItem(InterviewService.STORAGE_KEY, payload);
  }

  private normalizePersistedState(
    input: unknown,
  ): { steps: InterviewStep[]; activeStepId: number } | null {
    if (!this.isRecord(input)) {
      return null;
    }

    const persistedSteps = Array.isArray(input['steps']) ? input['steps'] : [];
    const doneById = new Map<number, boolean>();

    for (const persistedStep of persistedSteps) {
      if (!this.isRecord(persistedStep)) {
        continue;
      }

      const id = persistedStep['id'];
      const done = persistedStep['done'];

      if (typeof id === 'number' && typeof done === 'boolean') {
        doneById.set(id, done);
      }
    }

    const steps = this.cloneSteps(INITIAL_STEPS).map((step) => ({
      ...step,
      done: doneById.get(step.id) ?? step.done,
    }));

    const rawActiveStepId = input['activeStepId'];
    const firstStepId = steps[0].id;
    const activeStepExists =
      typeof rawActiveStepId === 'number' && steps.some((step) => step.id === rawActiveStepId);
    const activeStepId = activeStepExists ? rawActiveStepId : firstStepId;

    return { steps, activeStepId };
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  private getBrowserStorage(): Storage | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return window.localStorage;
  }
}

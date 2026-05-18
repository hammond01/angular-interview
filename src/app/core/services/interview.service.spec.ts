import { TestBed } from '@angular/core/testing';

import { INITIAL_STEPS } from '../data/interview-flow.data';
import { InterviewService } from './interview.service';

interface PersistedInterviewState {
  steps: { id: number; done: boolean }[];
  activeStepId: number;
}

describe('InterviewService', () => {
  const storageKey = 'angular-interview.flow.v1';

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [InterviewService],
    });
  });

  it('persists active step and completion state to localStorage', () => {
    const service = TestBed.inject(InterviewService);

    service.toggleStepDone(2);
    service.selectStep(3);
    TestBed.flushEffects();

    const raw = localStorage.getItem(storageKey);
    expect(raw).toBeTruthy();

    const parsed = JSON.parse(raw ?? '{}') as PersistedInterviewState;
    const secondStep = parsed.steps.find((step) => step.id === 2);

    expect(secondStep?.done).toBe(true);
    expect(parsed.activeStepId).toBe(3);
  });

  it('hydrates state from localStorage during initialization', () => {
    const persisted = {
      steps: INITIAL_STEPS.map((step) => ({ id: step.id, done: step.id === 4 })),
      activeStepId: 4,
    };
    localStorage.setItem(storageKey, JSON.stringify(persisted));

    const service = TestBed.inject(InterviewService);
    const restoredStep = service.stepsView().find((step) => step.id === 4);

    expect(service.activeStep().id).toBe(4);
    expect(restoredStep?.done).toBe(true);
  });

  it('falls back to default step when persisted active id is invalid', () => {
    const persisted = {
      steps: INITIAL_STEPS.map((step) => ({ id: step.id, done: false })),
      activeStepId: 999,
    };
    localStorage.setItem(storageKey, JSON.stringify(persisted));

    const service = TestBed.inject(InterviewService);
    expect(service.activeStep().id).toBe(INITIAL_STEPS[0].id);
  });
});

import { InterviewStep, TalkingPoint } from '../models/interview-step.model';

export const INITIAL_STEPS: InterviewStep[] = [
  {
    id: 1,
    title: 'Bootstrap the app',
    summary:
      'Angular starts at main.ts, configures providers in app.config.ts, then mounts the root component into index.html.',
    bullets: [
      'main.ts calls bootstrapApplication with the root component.',
      'app.config.ts wires router and global providers.',
      'The component tree grows from a single root host element.',
    ],
    sample: 'bootstrapApplication(App, appConfig);',
    done: true,
  },
  {
    id: 2,
    title: 'Keep state in signals',
    summary:
      'Local state lives in signal() values, and computed() creates derived values like progress and the active card.',
    bullets: [
      'signal() stores mutable local state.',
      'computed() keeps derived data predictable.',
      'update() and set() replace mutate-based state changes.',
    ],
    sample: 'const progress = computed(() => completedCount() / steps().length);',
    done: false,
  },
  {
    id: 3,
    title: 'Render with native control flow',
    summary:
      'The template uses @for and @if instead of legacy structural directives, which keeps the flow easier to read.',
    bullets: [
      '@for renders the step cards.',
      '@if can reveal optional details without extra wrappers.',
      'Events and bindings stay close to the UI they affect.',
    ],
    sample: '@for (step of steps(); track step.id) { ... }',
    done: false,
  },
  {
    id: 4,
    title: 'Explain it in the interview',
    summary:
      'Tie everything together by describing the boot sequence, state flow, template bindings, and accessibility decisions.',
    bullets: [
      'Start from the entry point and follow the data flow.',
      'Mention why signals make state changes obvious.',
      'Call out accessible buttons, headings, and focus-friendly interactions.',
    ],
    sample: 'One change in state re-renders the template automatically.',
    done: false,
  },
];

export const TALKING_POINTS: TalkingPoint[] = [
  {
    title: 'What to say first',
    text: 'I would begin with app bootstrap, then move to component state, then show how the template reacts to that state.',
  },
  {
    title: 'What to mention next',
    text: 'Signals and computed values are the easiest way to explain modern Angular state without introducing a service too early.',
  },
  {
    title: 'What to close with',
    text: 'I would finish by describing accessibility and the trade-off between a simple component and a scalable feature boundary.',
  },
];

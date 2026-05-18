# Contributing to Angular Interview Prep

First off, thanks for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

This project and everyone participating in it is governed by a Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps which reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed after following the steps**
- **Explain which behavior you expected to see instead and why**
- **Include screenshots and animated GIFs if possible**

### Suggesting Enhancements 💡

Enhancement suggestions are tracked as GitHub Issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests 🔀

- Follow the code style guidelines
- Include appropriate test cases
- Update documentation as needed
- End all files with a newline

## Development Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Getting Started

1. **Fork the repository**
   ```bash
   # On GitHub, click "Fork" button
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/angular-interview.git
   cd angular-interview
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/angular-interview.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

### Running the Project

```bash
# Development server (with hot reload)
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Format code with Prettier
npm run format

# Check code with ESLint
npm run lint

# Build for production
npm run build
```

## Code Style Guidelines

### JavaScript/TypeScript

We follow these conventions:

- **Indentation**: 2 spaces
- **Quotes**: Single quotes for strings
- **Semicolons**: Always use semicolons
- **Line length**: Aim for 100 characters max (soft limit)
- **Naming**:
  - Components: PascalCase (e.g., `InterviewPageComponent`)
  - Services: PascalCase with Service suffix (e.g., `InterviewService`)
  - Methods & variables: camelCase (e.g., `nextStep()`)
  - Constants: UPPER_SNAKE_CASE (e.g., `MAX_STEPS`)

### File Organization

```
feature/
├── feature-page.component.ts      # Container component
├── feature-page.component.html
├── feature-page.component.scss
├── feature-page.component.spec.ts
└── components/
    ├── card/
    │   ├── card.component.ts      # Presentational component
    │   ├── card.component.html
    │   └── card.component.scss
    └── list/
        ├── list.component.ts
        ├── list.component.html
        └── list.component.scss
```

### TypeScript Best Practices

```typescript
// ✅ Use strict types
function processStep(step: InterviewStep): void {
  // ...
}

// ❌ Avoid 'any'
function processStep(step: any): void {
  // ...
}

// ✅ Use readonly for immutable signals
readonly activeStep = this.steps.asReadonly();

// ✅ Use computed for derived state
readonly progress = computed(() => {
  return Math.round((this.completedCount() / this.totalSteps) * 100);
});

// ✅ Use OnPush change detection
@Component({
  selector: 'app-card',
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### HTML/Template Best Practices

```html
<!-- ✅ Use semantic HTML -->
<article>
  <h2>{{ title }}</h2>
  <p>{{ description }}</p>
</article>

<!-- ✅ Use native control flow (@if, @for) -->
@if (isLoading) {
  <app-spinner />
}

@for (item of items(); track item.id) {
  <app-card [item]="item" />
}

<!-- ✅ Include ARIA labels -->
<button
  type="button"
  aria-label="Toggle menu"
  (click)="toggleMenu()"
>
  Menu
</button>

<!-- ❌ Avoid inline styles -->
<div style="color: red;">Error</div>

<!-- ✅ Use CSS classes -->
<div class="error-message">Error</div>
```

### SCSS Best Practices

```scss
// ✅ Use nesting for clarity
.card {
  padding: 16px;
  
  &__title {
    font-weight: 600;
    color: var(--text-primary);
  }

  &:hover {
    background: var(--surface-hover);
  }
}

// ✅ Use CSS variables for theming
color: var(--text-primary);
background: var(--surface-base);

// ✅ Follow BEM for complex components
.step-list__item--active {
  // ...
}

// ❌ Avoid deep nesting (> 3 levels)
.a {
  .b {
    .c {
      .d { } // Too deep!
    }
  }
}
```

## Testing Guidelines

### Unit Tests

Every component and service should have tests:

```typescript
describe('InterviewService', () => {
  let service: InterviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InterviewService]
    });
    service = TestBed.inject(InterviewService);
  });

  it('should initialize with first step', () => {
    expect(service.activeStep()).toEqual(service.stepsView()[0]);
  });

  it('should move to next step', () => {
    service.nextStep();
    expect(service.activeStep().id).toBe(2);
  });
});
```

### Component Tests

```typescript
describe('StepListComponent', () => {
  let component: StepListComponent;
  let fixture: ComponentFixture<StepListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepListComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StepListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render step list', () => {
    component.steps = signal([
      { id: 1, title: 'Step 1' } as InterviewStep
    ]);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.step-list__item');
    expect(items.length).toBe(1);
  });
});
```

### Test Coverage Target

- **Services**: 100% coverage
- **Components**: 80%+ coverage (focus on logic, not template)
- **Overall**: 80%+ coverage

## Commit Message Guidelines

We follow Conventional Commits format:

```
type(scope): subject

body

footer
```

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning
- `refactor`: Code changes that neither fix bugs nor add features
- `perf`: Code changes that improve performance
- `test`: Adding or updating tests

### Examples

```
feat(interview): add keyboard shortcuts support

- Add @HostListener for keyboard events
- Support arrow keys and space bar
- Add keyboard hint UI with dismiss

Closes #123
```

```
fix(interview): prevent multiple step selections

The activeStep computed was recalculating on every
render, causing unnecessary re-renders.

Using memoization to fix this issue.
```

```
docs(readme): update installation instructions
```

## Pull Request Process

1. **Update your branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Push your changes**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request**
   - Use the PR template (if available)
   - Link related issues
   - Provide clear description of changes
   - Add screenshots for UI changes

4. **PR Template**
   ```markdown
   ## Description
   Brief description of what this PR does

   ## Type of Change
   - [ ] Bug fix (non-breaking change)
   - [ ] New feature (non-breaking change)
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing Done
   - [ ] Unit tests added/updated
   - [ ] Manual testing completed
   - [ ] Browser compatibility verified

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Tests passing locally
   - [ ] No new warnings generated
   - [ ] README updated (if needed)

   ## Related Issues
   Closes #123
   ```

5. **Review Process**
   - At least one review required
   - Address all feedback
   - Rebase and force-push if needed
   - Merge when approved

## Documentation

### Updating Documentation

- Keep README.md current
- Document architectural decisions
- Add comments for complex logic
- Update CHANGELOG.md for releases

### Code Comments

```typescript
// ✅ Good: explains WHY
// We use signals instead of subjects because they're simpler
// and don't require subscription cleanup in templates
readonly activeStep = computed(() => 
  this.steps().find(s => s.id === this.activeStepId())
);

// ❌ Bad: states the obvious
// Get the active step
readonly activeStep = computed(() => ...);

// ✅ Good: documents public API
/**
 * Moves to the next step in the interview flow.
 * If at the last step, loops back to the first step.
 * 
 * @example
 * service.nextStep(); // Moves to next step
 */
nextStep(): void {
  // ...
}
```

## Performance Considerations

- ✅ Use `OnPush` change detection strategy
- ✅ Implement `trackBy` in `@for` loops
- ✅ Use lazy loading for routes
- ✅ Minimize bundle size
- ✅ Use `untrackSignal()` for large lists if needed
- ❌ Avoid `NgZone` unless absolutely necessary
- ❌ Don't subscribe to signals in templates (use async pipe or computed)

## Accessibility

All contributions must meet WCAG 2.1 Level AA standards:

- ✅ Semantic HTML elements (`<button>`, `<header>`, `<nav>`)
- ✅ ARIA labels for interactive elements
- ✅ Keyboard navigation support
- ✅ Sufficient color contrast (4.5:1 for normal text)
- ✅ Focus indicators visible
- ✅ Form labels associated with inputs
- ✅ Alternative text for images

Test accessibility:
```bash
# Use Lighthouse (Chrome DevTools → Lighthouse tab)
# Use WAVE browser extension
# Test keyboard navigation manually
```

## Resources

- [Angular Style Guide](https://angular.io/guide/styleguide)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Best Practices](https://web.dev/performance/)

## Questions?

Feel free to open an issue with the label `question` or start a discussion.

---

**Thank you for contributing!** 🎉

import { ChangeDetectionStrategy, Component, HostListener, inject, signal } from '@angular/core';

import { InterviewService } from '../../core/services/interview.service';
import { StepDetailComponent } from './components/step-detail/step-detail.component';
import { StepListComponent } from './components/step-list/step-list.component';

/**
 * Interview page container.
 *
 * This demonstrates:
 * - Injecting a service with inject() function (modern pattern)
 * - Using readonly computed signals from the service
 * - Delegating business logic to the service
 * - Keyboard event handling with @HostListener
 */
@Component({
  selector: 'app-interview-page',
  imports: [StepListComponent, StepDetailComponent],
  templateUrl: './interview-page.component.html',
  styleUrl: './interview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'main'
  }
})
export class InterviewPageComponent {
  protected readonly showKeyboardHint = signal(true);
  private readonly interviewService = inject(InterviewService);

  protected readonly title = signal('Angular interview flow');
  protected readonly subtitle = signal('A tiny demo app that shows how Angular bootstrap, signals, computed values, and native control flow fit together.');
  protected readonly steps = this.interviewService.stepsView;
  protected readonly talkingPoints = this.interviewService.talkingPointsView;
  protected readonly activeStepId = this.interviewService.activeStepIdView;
  protected readonly activeStep = this.interviewService.activeStep;
  protected readonly completedCount = this.interviewService.completedCount;
  protected readonly progress = this.interviewService.progress;

  protected selectStep(stepId: number): void {
    this.interviewService.selectStep(stepId);
  }

  protected toggleStepDone(stepId: number): void {
    this.interviewService.toggleStepDone(stepId);
  }

  protected nextStep(): void {
    this.interviewService.nextStep();
  }

  protected resetFlow(): void {
    this.interviewService.resetFlow();
  }

  protected hideKeyboardHint(): void {
    this.showKeyboardHint.set(false);
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyboardEvent(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousStep();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextStep();
        break;
      case ' ':
        event.preventDefault();
        this.toggleStepDone(this.activeStep().id);
        break;
    }
  }

  private previousStep(): void {
    const currentSteps = this.steps();
    const currentIndex = currentSteps.findIndex((step) => step.id === this.activeStepId());
    const previousIndex = currentIndex === 0 ? currentSteps.length - 1 : currentIndex - 1;
    const previousStep = currentSteps[previousIndex];

    this.selectStep(previousStep.id);
  }
}

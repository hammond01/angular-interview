import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InterviewStep } from '../../../../core/models/interview-step.model';

@Component({
  selector: 'app-step-list',
  templateUrl: './step-list.component.html',
  styleUrl: './step-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepListComponent {
  readonly steps = input.required<InterviewStep[]>();
  readonly activeStepId = input.required<number>();
  readonly stepSelected = output<number>();

  protected selectStep(stepId: number): void {
    this.stepSelected.emit(stepId);
  }
}

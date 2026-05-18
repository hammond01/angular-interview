import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { InterviewStep, TalkingPoint } from '../../../../core/models/interview-step.model';

@Component({
  selector: 'app-step-detail',
  templateUrl: './step-detail.component.html',
  styleUrl: './step-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepDetailComponent {
  readonly step = input.required<InterviewStep>();
  readonly talkingPoints = input.required<TalkingPoint[]>();
  readonly toggleDone = output<number>();

  protected toggleCurrentStep(): void {
    this.toggleDone.emit(this.step().id);
  }
}

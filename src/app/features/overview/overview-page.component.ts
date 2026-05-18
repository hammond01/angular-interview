import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Overview page shows the interview prep structure.
 * This component demonstrates:
 * - Simple presentational component (no heavy state)
 * - RouterLink for client-side navigation
 * - OnPush change detection for performance
 */
@Component({
  selector: 'app-overview-page',
  imports: [RouterLink],
  templateUrl: './overview-page.component.html',
  styleUrl: './overview-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewPageComponent {}

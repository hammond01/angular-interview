import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/overview/overview-page.component').then(
        (m) => m.OverviewPageComponent
      )
  },
  {
    path: 'interview',
    loadComponent: () =>
      import('./features/interview/interview-page.component').then(
        (m) => m.InterviewPageComponent
      )
  },
  {
    path: '**',
    redirectTo: ''
  }
];

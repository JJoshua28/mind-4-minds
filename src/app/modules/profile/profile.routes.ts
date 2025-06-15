import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'user-details',
    title: 'User Details',
    loadComponent: () => import('./components/user-details/user-details.component').then(m => m.UserDetailsComponent)
  },
  {
    path: 'mentor-details',
    title: 'Mentor Details',
    loadComponent: () => import('./page/mentor/mentor.component').then(m => m.MentorComponent)
  },
  {
    path: 'mentee-details',
    title: 'Mentor Details',
    loadComponent: () => import('./page/mentee-details/mentee-details-page.component').then(m => m.MenteeDetailsPageComponent)
  }
];

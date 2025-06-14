import {Routes} from "@angular/router";

export const registerRoutes: Routes = [
  {
    path: "roles",
    title: "Roles",
    loadComponent: () => import('./page/roles/roles.component').then(m => m.RolesComponent),
  },
  {
    path: "user-details",
    title: "User Details",
    loadComponent: () => import('./page/register-user-details-page/register-user-details-page.component').then(m => m.RegisterUserDetailsPageComponent),

  },
  {
    path: "mentee-details",
    title: "Mentee Details",
    loadComponent: () => import('./page/register-mentee-details-page/register-mentee-details-page.component').then(m => m.RegisterMenteeDetailsPageComponent),

  }
];

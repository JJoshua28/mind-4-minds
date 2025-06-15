import { Routes } from '@angular/router';

// Lazy load the profile children routes as a module (exported separately)
export const routes: Routes = [
  {
    path: "login",
    title: "Login",
    loadComponent: () => import('./modules/login/page/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
  {
    path: "register",
    redirectTo: "register/roles",
    pathMatch: "full",
  },
  {
    path: "register",
    loadComponent: () => import('./modules/register/page/registeration-layout-page/registration-layout-page.component').then(m => m.RegistrationLayoutPageComponent),
    children: [
      {
        path: "roles",
        title: "Roles",
        loadComponent: () => import('./modules/register/page/roles/roles.component').then(m => m.RolesComponent),
      }
    ]
  },
  {
    path: "",
    loadComponent: () => import('./modules/main-layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'find-a-mentor',
        title: 'Find a mentor',
        loadComponent: () => import('./modules/mentor-search/page/mentor-search-page/mentor-search-page.component').then(m => m.MentorSearchPageComponent),
      },
      {
        path: 'inbox',
        title: 'Inbox',
        loadComponent: () => import('./modules/inbox/page/inbox-page/inbox-page.component').then(m => m.InboxPageComponent),
      },
      {
        path: 'profile',
        pathMatch: 'full',
        redirectTo: 'profile/user-details'
      },
      {
        path: 'my-mentors',
        title: 'My Mentors',
        loadComponent: () => import('./modules/my-mentors/page/my-mentors-page/my-mentors-page.component').then(m => m.MyMentorsPageComponent)
      },
      {
        path: 'my-mentees',
        title: 'My Mentees',
        loadComponent: () => import('./modules/my-mentees/page/my-mentees-page/my-mentees-page.component').then(m => m.MyMenteesPageComponent)
      },
      {
        path: 'profile',
        title: 'Profile',
        loadComponent: () => import('./modules/profile/page/profile/profile.component').then(m => m.ProfileComponent),
        loadChildren: () => import('./modules/profile/profile.routes').then(m => m.profileRoutes)
      },
      {
        path: 'profile/user-details/edit',
        title: "Edit: User Details",
        loadComponent: () => import('./modules/profile/page/edit-user-details/edit-user-details.component').then(m => m.EditUserDetailsComponent),
      },
      {
        path: 'profile/mentor-details/edit',
        title: "Edit: Mentor Details",
        loadComponent: () => import('./modules/profile/page/edit-mentor/edit-mentor.component').then(m => m.EditMentorComponent),
      },
      {
        path: 'profile/mentee-details/edit',
        title: "Edit: Mentee Details",
        loadComponent: () => import('./modules/profile/page/edit-mentee/edit-mentee.component').then(m => m.EditMenteeComponent),
      }
    ]
  }
];

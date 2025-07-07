import { Routes } from '@angular/router';
import {AuthGuard} from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "login",
    title: "Login",
    loadComponent: () => import('./modules/login/page/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: "",
    redirectTo: "inbox",
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
    loadChildren: () => import('./modules/register/register.routes').then(m => m.registerRoutes)

  },
  {
    path: "",
    loadComponent: () => import('./modules/main-layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: 'find-a-mentor',
        title: 'Find a mentor',
        loadComponent: () => import('./modules/mentor-search/page/mentor-search-page/mentor-search-page.component').then(m => m.MentorSearchPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'inbox',
        title: 'Inbox',
        loadComponent: () => import('./modules/inbox/page/inbox-page/inbox-page.component').then(m => m.InboxPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'my-mentors',
        title: 'My Mentors',
        loadComponent: () => import('./modules/my-mentors/page/my-mentors-page/my-mentors-page.component').then(m => m.MyMentorsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'my-mentees',
        title: 'My Mentees',
        loadComponent: () => import('./modules/my-mentees/page/my-mentees-page/my-mentees-page.component').then(m => m.MyMenteesPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'user-details/edit/:changeType/:userDetailsId',
        title: "Edit: User Details",
        loadComponent: () => import('./modules/profile/page/edit-user-details/edit-user-details-page.component').then(m => m.EditUserDetailsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'mentor-details/edit/:userDetailsId',
        title: "Edit: Mentor Details",
        loadComponent: () => import('./modules/profile/page/edit-mentor/edit-mentor-details-page.component').then(m => m.EditMentorDetailsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'mentee-details/edit/:userDetailsId',
        title: "Edit: Mentee Details",
        loadComponent: () => import('./modules/profile/page/edit-mentee/edit-mentee-details-page.component').then(m => m.EditMenteeDetailsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: 'users',
        title: 'Users',
        loadComponent: () => import("./modules/manage-users/page/manage-users/manage-users.component").then(m => m.ManageUsersComponent),
        canMatch: [AuthGuard]
      },
      {
        path: "user-details/:userDetailsId",
        title: "User Details",
        loadComponent: () => import('./modules/profile/page/user-details-page/user-details-page.component').then(m => m.UserDetailsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: "mentor-details/:userDetailsId",
        title: "Mentor Details",
        loadComponent: () => import('./modules/profile/page/mentor-details-page/mentor-details-page.component').then(m => m.MentorDetailsPageComponent),
        canMatch: [AuthGuard]
      },
      {
        path: "mentee-details/:userDetailsId",
        title: "Mentee Details",
        loadComponent: () => import('./modules/profile/page/mentee-details-page/mentee-details-page.component').then(m => m.MenteeDetailsPageComponent),
        canMatch: [AuthGuard]
      }
    ]
  }
];

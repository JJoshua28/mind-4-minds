import { Routes } from '@angular/router';
import {MentorSearchPageComponent} from "./modules/mentor-search/page/mentor-search-page/mentor-search-page.component";
import {InboxPageComponent} from "./modules/inbox/page/inbox-page/inbox-page.component";
import {ProfileComponent} from "./modules/profile/page/profile/profile.component";
import {UserDetailsComponent} from "./modules/profile/components/user-details/user-details.component";
import {EditUserDetailsComponent} from "./modules/profile/page/edit-user-details/edit-user-details.component";
import {MentorComponent} from "./modules/profile/page/mentor/mentor.component";

export const routes: Routes = [
  {
    path: ``,
    redirectTo: '/find-a-mentor',
    pathMatch: 'full',
  },
  {
    path: 'find-a-mentor',
    component: MentorSearchPageComponent,
    title: 'Find a mentor',
  },
  {
    path: 'inbox',
    component: InboxPageComponent,
    title: 'Inbox',
  },
  {
    path: 'profile',
    pathMatch: 'full',
    redirectTo: 'profile/user-details'
  },
  {
    path: 'profile',
    component: ProfileComponent,
    title: 'Profile',
    children: [
    {
      path: 'user-details',
      title: 'User Details',
      component: UserDetailsComponent
    },
      {
        path: 'mentor-details',
        title: 'Mentor Details',
        component: MentorComponent
      }
    ]
  },
  {
    path: 'profile/user-details/edit',
    component:EditUserDetailsComponent,
    title: "Edit: User Details",
  }
];

import { Routes } from '@angular/router';
import {MentorSearchPageComponent} from "./modules/mentor-search/page/mentor-search-page/mentor-search-page.component";
import {InboxPageComponent} from "./modules/inbox/page/inbox-page/inbox-page.component";
import {ProfileComponent} from "./modules/profile/page/profile/profile.component";

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
    component: ProfileComponent,
    title: 'Profile',
  }
];

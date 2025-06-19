import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  MY_MENTEES = "my mentees",
  inbox='inbox',
  MY_MENTORS = "my mentors",
  profile='profile',
}

enum SecondLevelNavigationItems {
  MY_MENTORS = "my mentors",
  MY_MENTEES = "my mentees",
  FIND_A_MENTOR="find a mentor",
  inbox='inbox',
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})

export class NavigationBarComponent {
  private _router = inject(Router);

  $hasNewInboxMessage: WritableSignal<boolean> = signal<boolean>(true);
  $navigationItems: Signal<SecondLevelNavigationItems[]> = signal(Object.values(SecondLevelNavigationItems));

  private routeMapper (navigationItem: NavigationItems): string {
    let navigationRoute = '';

    switch(navigationItem) {
      case NavigationItems.FIND_A_MENTOR:
        navigationRoute = 'find-a-mentor';
        break;
      case NavigationItems.inbox:
        navigationRoute = 'inbox';
        break;
      case NavigationItems.profile:
        navigationRoute = 'profile';
        break;
      case NavigationItems.MY_MENTORS:
        navigationRoute = 'my-mentors';
        break;
      case NavigationItems.MY_MENTEES:
        navigationRoute = 'my-mentees';
        break;
    }

    return navigationRoute

  }

  handleNavigateTo(navigationItem: string) {
    const navigationRoute = this.routeMapper(navigationItem as NavigationItems);
    this._router.navigate([navigationRoute]);
  }


  protected readonly NavigationItems = NavigationItems;
}

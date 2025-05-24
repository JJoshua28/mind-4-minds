import {Component, inject, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  REQUESTS_AND_NOTIFICATION='inbox',
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
  $navigationItems: Signal<NavigationItems[]> = signal(Object.values(NavigationItems));

  private routeMapper (navigationItem: string): string {
    let navigationRoute = '';

    switch(navigationItem) {
      case NavigationItems.FIND_A_MENTOR:
        navigationRoute = 'find-a-mentor';
        break;
      case NavigationItems.REQUESTS_AND_NOTIFICATION:
        navigationRoute = 'inbox';
        break;
    }

    return navigationRoute

  }

  handleNavigateTo(navigationItem: NavigationItems) {
    const navigationRoute = this.routeMapper(navigationItem);
    this._router.navigate([navigationRoute]);
  }


}

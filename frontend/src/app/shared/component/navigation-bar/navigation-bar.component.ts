import {Component, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";
import {UserService} from "../../services/user/user-service.service";
import {UserType} from "../../../types/user-type.enum";
import {map} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";

enum NavigationItems {
  FIND_A_MENTOR="find a mentor",
  MY_MENTEES = "my mentees",
  inbox='inbox',
  MY_MENTORS = "my mentors",
  profile='profile',
  users='users',
}

enum SecondLevelNavigationItems {
  MY_MENTORS = "my mentors",
  MY_MENTEES = "my mentees",
  FIND_A_MENTOR="find a mentor",
  INBOX='inbox',
  USERS = "users",
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  providers: [
    UserService,
  ],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})

export class NavigationBarComponent implements OnInit {
  private _router = inject(Router);

  private _userService = inject(UserService);

  $roles!: Signal<UserType[]>;
  $hasNewInboxMessage: WritableSignal<boolean> = signal<boolean>(true);
  $navigationItems!: Signal<SecondLevelNavigationItems[]>;

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
      case NavigationItems.users:
        navigationRoute = 'users';
        break;
    }

    return navigationRoute

  }

  ngOnInit(): void {
    this._userService.userDetails().pipe(map(user => user.roles))
      .subscribe(userRoles => {
        this.$roles = signal(userRoles);
        this.$navigationItems = signal(this.generateRoles(this.$roles()));
      })
  }

  generateRoles(roles: UserType[]) {
    let navigationItems = Object.values(SecondLevelNavigationItems);
    if(!roles.includes(UserType.MENTEE))
    {
      navigationItems = navigationItems.filter(item => item !== SecondLevelNavigationItems.FIND_A_MENTOR);
      navigationItems = navigationItems.filter(item => item !== SecondLevelNavigationItems.MY_MENTORS);
    }
    if(!roles.includes(UserType.MENTOR)){
      navigationItems = navigationItems.filter(item => item !== SecondLevelNavigationItems.MY_MENTEES);
    }
    if(!roles.includes(UserType.ADMIN)){
      navigationItems = navigationItems.filter(item => item !== SecondLevelNavigationItems.USERS);
    }

    return navigationItems;
  }

  handleNavigateTo(navigationItem: string) {
    const navigationRoute = this.routeMapper(navigationItem as NavigationItems);
    this._router.navigate([navigationRoute]);
  }


  protected readonly NavigationItems = NavigationItems;
}

import {Component, computed, inject, OnDestroy, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../services/user/user-service.service";
import {UserType} from "../../../types/user-type.enum";
import {filter, map, Subscription} from "rxjs";
import {toObservable, toSignal} from "@angular/core/rxjs-interop";
import {RequestsRepositoryService} from "../../repositories/requests.repository.service";
import {environment} from "../../../../environments/environment";

enum NavigationItems {
  inbox='inbox',
  FIND_A_MENTOR="find a mentor",
  MY_MENTEES = "my mentees",
  MY_MENTORS = "my mentors",
  users='users',
  profile='profile',
}

enum SecondLevelNavigationItems {
  INBOX='inbox',
  MY_MENTORS = "my mentors",
  MY_MENTEES = "my mentees",
  FIND_A_MENTOR="find a mentor",
  USERS = "users",
}

@Component({
  selector: 'app-navigation-bar',
  standalone: true,
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.scss'
})

export class NavigationBarComponent implements OnInit, OnDestroy {
  private _router = inject(Router);

  private readonly _subscriptions: Subscription = new Subscription();

  protected userService = inject(UserService);
  private readonly _requestsService = inject(RequestsRepositoryService);

  protected readonly logo = environment.logo;

  $hasNewInboxMessage: WritableSignal<boolean> = signal<boolean>(false);

  $navigationItems: WritableSignal<SecondLevelNavigationItems[]> = signal(this.generateRoles(this.userService.$userDetails().roles));
  //
  constructor() {
    toObservable(this.userService.$userDetails).subscribe((user) => {
      this.$navigationItems.set(this.generateRoles(user.roles));
    });
  }

  ngOnInit(): void {
    this._subscriptions.add(
      this._requestsService.hasNewRequests(this.userService.$userDetails().id).subscribe(hasNewRequests => {
        this.$hasNewInboxMessage.set(hasNewRequests);
      })
    )
  }

  ngOnDestroy(): void {
    this._subscriptions.unsubscribe();
  }

  private routeMapper (navigationItem: NavigationItems): string {
    let navigationRoute = '';

    switch(navigationItem) {
      case NavigationItems.inbox:
        navigationRoute = 'inbox';
        break;
      case NavigationItems.FIND_A_MENTOR:
        navigationRoute = 'find-a-mentor';
        break;
      case NavigationItems.profile:
        navigationRoute = `user-details/${this.userService.$userDetails().id}`;
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

  navigateHome() {
      let landingPage = ""

      if (this.userService.$userDetails().roles.includes(UserType.MENTEE)) {
        landingPage = "my-mentors"
      } else if (this.userService.$userDetails().roles.includes(UserType.MENTOR)) {
        landingPage = "my-mentees"
      } else if (this.userService.$userDetails().roles.includes(UserType.ADMIN)) {
        landingPage = "users"
      }
      else {
        landingPage = `/user-details/${this.userService.$userDetails().id}`
      }
      this._router.navigate([`/${landingPage}`]);
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

import {Component, inject, OnInit, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {UserType} from "../../../../types/user-type.enum";

export enum NavigationItems {
  USER_DETAILS = "user-details",
  MENTOR_DETAILS = "mentor-details",
  MENTEE_DETAILS = "mentee-details"
}

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [],
  providers: [
    UserService
  ],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.scss'
})
export class SidebarNavigationComponent implements OnInit {
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private readonly _userService: UserService = inject(UserService);

  $roles: WritableSignal<UserType[]> = signal<UserType[]>([]);

  ngOnInit() {
    this._userService.userDetails().subscribe(userDetails => {
      this.$roles.set(userDetails.roles);
    })
  }

  handleNavigateTo(navigationItemPath: string) {
    this._router.navigate([`./${navigationItemPath}`], { relativeTo: this._route });
  }

  protected readonly NavigationItems = NavigationItems;
  protected readonly UserType = UserType
}

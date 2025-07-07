import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit, Output,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {UserType} from "../../../../types/user-type.enum";
import {filter, forkJoin, map, of, Subscription, take, tap} from "rxjs";
import {UserDetails} from "../../../../types/user.interface";
import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {combineLatest} from "rxjs/internal/operators/combineLatest";
import {RequestsRepositoryService} from "../../../../shared/repositories/requests.repository.service";
import {ActionType} from "../../../../types/action-type.enum";
import {subscribe} from "node:diagnostics_channel";

export enum NavigationItems {
  USER_DETAILS = "user-details",
  MENTOR_DETAILS = "mentor-details",
  MENTEE_DETAILS = "mentee-details"
}

@Component({
  selector: 'app-sidebar-navigation',
  standalone: true,
  imports: [
    ConfirmActionModalComponent
  ],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.scss'
})
export class SidebarNavigationComponent {
  @Output() updateData = new EventEmitter<void>();
  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;

  private readonly _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private readonly userRepository = inject(UserRepository);
  private readonly requestRepository = inject(RequestsRepositoryService);

  private readonly _userService: UserService = inject(UserService);

  readonly confirmActionText = "relinquish your admin privileges";
  readonly confirmActionType = ActionTypes.DELETE;

  protected readonly NavigationItems = NavigationItems;
  protected readonly UserType = UserType

  $userDetails = input.required<UserDetails>();

  $roles = computed(() => this.$userDetails().roles);

  handleNavigateTo(navigationItemPath: string) {
    this._router.navigate([`/${navigationItemPath}/${this.$userDetails().id}`], { relativeTo: this._route });
  }

  removeAdminPrivileges() {
    const { email, isArchived, isAdmin, profilePic, ...details } = this.$userDetails();
    const roles: UserType[] = this.$userDetails().roles.filter(role => role !== UserType.ADMIN);

    const updateAccount$ = this.userRepository.updateUserAccount(
      {
        email,
        isArchived,
        isAdmin: false,
      },
      details.accountId
    );

    const updateDetails$ = this.userRepository.updateUserDetails(
      {
        ...details,
        roles: roles,
      },
      this.$userDetails().id
    );


    forkJoin([updateAccount$, updateDetails$])
      .pipe(
        take(1),
        map(([userAccount, userDetail]) => {
          if(this._userService.$userDetails().id === this.$userDetails().id) {
            const {mentorDetails, menteeDetails, ...userDetailsUpdate} = userDetail;
            this._userService.updateData(userDetailsUpdate);
          }
          return of(null);
        })
      )
      .subscribe(() => {
        this.updateData.emit();
      });
  }

  requestAdminPrivileges() {
    const { profilePic, ...details } = this.$userDetails();
    const roles: UserType[] = [
      ...this.$userDetails().roles,
      UserType.ADMIN
    ];

    const adminRequest = {
      sender: this.$userDetails().id,
      recipients: [],
      body: "I would like to request admin permissions on the system.",
      subject: "Admin Request",
      action_type: ActionType.ADMIN_PERMISSIONS,
    }

    forkJoin([
      this.userRepository.updateUserDetails({...details, roles}, this.$userDetails().id),
      this.requestRepository.createAdminRequest(adminRequest)
    ]).pipe(
      take(1),
      map(([userDetail, request]) => {
        if(this._userService.$userDetails().id === this.$userDetails().id) {
          const {mentorDetails, menteeDetails, ...userDetailsUpdate} = userDetail;
          this._userService.updateData(userDetailsUpdate);
        }
        return of(null);
      })
    ).subscribe(() => {
      this.updateData.emit();
    });
  }
}

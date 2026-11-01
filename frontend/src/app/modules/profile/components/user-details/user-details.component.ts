import {
  Component,
  computed, EventEmitter,
  inject,
  input,
  Output,
  Signal,
} from '@angular/core';
import {Router} from "@angular/router";
import {experienceDuration} from "../../../../shared/helpers/experienceDurations";

import {UserInfo} from "../../../../types/user details/user-info.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";
import { take, tap} from "rxjs";

import {AuthServiceService} from "../../../../shared/services/auth-service.service";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {NgClass} from "@angular/common";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: ' app-user-details',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {

  @Output() refreshData = new EventEmitter<void>();
  private _router = inject(Router);

  private readonly _userRepository = inject(UserRepository);
  private readonly _authService = inject(AuthServiceService);
  protected readonly _userService = inject(UserService);

  private readonly defaultProfilePic = environment.defaultProfilePic;


  $accountId = computed(() => this.$userAccount().id);

  $isAdmin = computed(() => this.$userAccount().isAdmin);

  $userAccount = input.required<UserInfo>();

  $isArchived = computed(() => this.$userAccount().isArchived);

  $profilePic = computed(() => { return this.$userAccount()?.profilePic || this.defaultProfilePic
  })

  $occupationStartDate: Signal<Date> = computed(() => {
      return new Date(this.$userAccount()?.occupationStartDate as string);
  })



  logout() {
    this._authService.logout();
  }

  editDetails() {
    const changeType = this._userService.$userAccount().id === this.$userAccount().id ? "user" : "admin";
    this._router.navigate([`/user-details/edit/${changeType}/${this.$userAccount().id}`]);
  }

  toggleAccountStatus() {
    const accountUpdates = {
      isArchived: !this.$isArchived(),
      isAdmin: this.$isAdmin(),
      email: this.$userAccount()?.email
    };

    this._userRepository.updateUserAccount(accountUpdates, this.$accountId()).pipe(
      take(1),
      tap((user) => {
        if(this._userService.$userAccount().id === this.$userAccount().id)
        {
          const {email, isAdmin, isArchived} = user;

          this._userService.updateData({
            email,
            isAdmin,
            isArchived: isArchived
          });
        }
      }),
      take(1),
    ).subscribe(() => {
      this.refreshData.emit()
    });
  }

  protected readonly experienceDuration = experienceDuration;
  protected readonly Date = Date;
}

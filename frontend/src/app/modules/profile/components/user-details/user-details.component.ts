import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";
import {experienceDuration} from "../../../../shared/helpers/experienceDurations";

import {UserInfo} from "../../../../types/user details/user-info.interface";
import {UserServiceService} from "../../../../shared/services/user/user-service.service";
import {map, take} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthServiceService} from "../../../../shared/services/auth-service.service";



@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent  {
  private _router = inject(Router);

  private readonly _userService = inject(UserServiceService);
  private readonly _authService = inject(AuthServiceService);

  $userStatus = toSignal(this._userService.userDetails().pipe(map(user => user.isArchived))) as Signal<boolean>;

  $user = toSignal(this._userService.userInfo()) as Signal<UserInfo>;

  $profilePic = computed(() => { return this.$user()?.profilePic || "/assets/images/default.jpeg"
  })

  $occupationStartDate: Signal<Date> = computed(() => {
      return new Date(this.$user()?.occupationStartDate as string);
  })

  logout() {
    this._authService.logout();
  }

  editDetails() {
    this._router.navigate(['/profile/user-details/edit']);
  }

  toggleAccountStatus() {
    this._userService.updateUserAccount(
      {
        isArchived: this.$userStatus(),
        email: this.$user()?.email
      }).subscribe(() => {
        this.$user = toSignal(this._userService.userInfo()) as Signal<UserInfo>;
      }
    )
  }

  protected readonly experienceDuration = experienceDuration;
  protected readonly Date = Date;
}

import {
  Component,
  computed, EventEmitter,
  inject,
  input,
  OnChanges,
  OnInit, Output,
  Signal,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {Router} from "@angular/router";
import {experienceDuration} from "../../../../shared/helpers/experienceDurations";

import {UserInfo} from "../../../../types/user details/user-info.interface";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {map, take, tap} from "rxjs";
import {toSignal} from "@angular/core/rxjs-interop";
import {AuthServiceService} from "../../../../shared/services/auth-service.service";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {NgClass} from "@angular/common";
import {UserDetails} from "../../../../types/user.interface";

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

  $accountId = computed(() => this.$userDetails().accountId);

  $isAdmin = computed(() => this.$userDetails().isAdmin);

  $userDetails = input.required<UserDetails>();

  $isArchived = computed(() => this.$userDetails().isArchived);

  $user: Signal<UserInfo> = computed(() => {
    return {
      firstName: this.$userDetails().firstName,
      lastName: this.$userDetails().lastName,
      email: this.$userDetails().email,
      profilePic: this.$userDetails().profilePic,
      occupation: this.$userDetails().occupation,
      occupationStartDate: this.$userDetails().occupationStartDate,
    };
  });


  $profilePic = computed(() => { return this.$user()?.profilePic || "/assets/images/default.jpeg"
  })

  $occupationStartDate: Signal<Date> = computed(() => {
      return new Date(this.$user()?.occupationStartDate as string);
  })



  logout() {
    this._authService.logout();
  }

  editDetails() {
    const changeType = this._userService.$userDetails().id === this.$userDetails().id ? "user" : "admin";
    this._router.navigate([`/user-details/edit/${changeType}/${this.$userDetails().id}`]);
  }

  toggleAccountStatus() {
    const accountUpdates = {
      isArchived: !this.$isArchived(),
      isAdmin: this.$isAdmin(),
      email: this.$user()?.email
    };

    this._userRepository.updateUserAccount(accountUpdates, this.$accountId()).pipe(
      take(1),
      tap((user) => {
        if(this._userService.$userDetails().id === this.$userDetails().id)
        {
          this._userService.updateData(user);
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

import {
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserRepository} from "../../../../shared/repositories/user.repository";

import {Subscription, switchMap, take} from "rxjs";
import {SidebarNavigationComponent} from "../../components/sidebar-navigation/sidebar-navigation.component";
import {UserDetailsComponent} from "../../components/user-details/user-details.component";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {UserInfo} from "../../../../types/user details/user-info.interface";

@Component({
  selector: 'app-user-details-page',
  standalone: true,
  imports: [
    SidebarNavigationComponent,
    UserDetailsComponent
  ],
  templateUrl: './user-details-page.component.html',
  styleUrl: './user-details-page.component.scss'
})
export class UserDetailsPageComponent implements OnInit, OnChanges, OnDestroy {
  private readonly _route = inject(ActivatedRoute)
  private readonly _userRepository = inject(UserRepository)
  private readonly _userService = inject(UserService)

  private readonly subscriptions: Subscription = new Subscription()

  protected userAccount!: WritableSignal<UserInfo>;

  accountId = input.required<string>()

  ngOnInit(): void {
    this.subscriptions.add(
      this._route.params.pipe(
        switchMap(params => {
          const userId = params['accountId'];
          return this._userRepository.getUserInfoById(userId);
        }),
        take(1),
      ).subscribe((accountDetails) => {
        this.userAccount = signal(accountDetails);
      })
    );
  }

  ngOnChanges(changes:SimpleChanges): void {
    const newAccountId = changes['accountId']?.currentValue
    if(!changes?.['accountId']?.firstChange && newAccountId) {
      this._userRepository.getUserById(newAccountId).pipe(
        take(1),
      ).subscribe((user) => {
        this.userAccount.set(user);
      })
    }
  }

  refreshDetails() {
    this._userRepository.getUserById(this.accountId()).pipe(
      take(1),
    ).subscribe((user) => {
      this.userAccount.set(user);
      if(this._userService.$userAccount().id === this.accountId()) {
        this._userService.updateData(user);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

import {
  Component,
  inject,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  signal,
  Signal,
  SimpleChanges,
  WritableSignal
} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserRepository} from "../../../../shared/repositories/user.repository";

import {UserDetails} from "../../../../types/user.interface";
import {map, Subscription, switchMap, take} from "rxjs";
import {SidebarNavigationComponent} from "../../components/sidebar-navigation/sidebar-navigation.component";
import {UserDetailsComponent} from "../../components/user-details/user-details.component";
import {UserService} from "../../../../shared/services/user/user-service.service";

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

  protected userDetails!: WritableSignal<UserDetails>;

  userDetailsId = input.required<string>()

  ngOnInit(): void {
    this.subscriptions.add(
      this._route.params.pipe(
        switchMap(params => {
          const userId = params['userDetailsId'];
          return this._userRepository.getUserDetailsById(userId);
        }),
        take(1),
      ).subscribe((userDetails) => {
        this.userDetails = signal(userDetails);
      })
    );
  }

  ngOnChanges(changes:SimpleChanges): void {
    const newUserDetailsId = changes['userDetailsId']?.currentValue
    if(!changes?.['userDetailsId']?.firstChange && newUserDetailsId) {
      this._userRepository.getUserDetailsById(newUserDetailsId).pipe(
        take(1),
      ).subscribe((userDetails) => {
        this.userDetails.set(userDetails);
      })
    }
  }

  refreshDetails() {
    this._userRepository.getUserDetailsById(this.userDetailsId()).pipe(
      take(1),
    ).subscribe((userDetails) => {
      this.userDetails.set(userDetails);
      if(this._userService.$userDetails().id === this.userDetailsId()) {
        this._userService.updateData(userDetails);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

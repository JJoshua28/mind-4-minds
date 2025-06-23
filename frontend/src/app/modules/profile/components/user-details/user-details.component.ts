import {Component, computed, inject, OnInit, Signal, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";
import {experienceDuration} from "../../../../shared/helpers/experienceDurations";

import {UserInfo} from "../../../../types/user details/user-info.interface";
import {UserServiceService} from "../../../../shared/services/user/user-service.service";



@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  private _router = inject(Router);

  private readonly _userService = inject(UserServiceService);

  ngOnInit() {
    this._userService.userDetails()
  }

  $user: WritableSignal<UserInfo> = signal({
    id: 1,
    firstName: "vorname",
    email: "vorname@gmail.com",
    lastName: "nachname",
    occupation: "carer",
    occupationStartDate: new Date(5).toDateString(),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  })

  $occupationStartDate: Signal<Date> = computed(() => {
      return new Date(this.$user()?.occupationStartDate as string);
  })


  editDetails() {
    this._router.navigate(['/profile/user-details/edit']);
  }


  protected readonly experienceDuration = experienceDuration;
  protected readonly Date = Date;
}

import {Component, computed, inject, Signal, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";
import {experienceDuration} from "../../../../shared/helpers/experienceDurations";

import {UserInfo} from "../../../../types/user details/user-info.interface";



@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private _router = inject(Router);

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

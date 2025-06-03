import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";
import {formatDistance} from "date-fns";

export interface User {
  firstname: string;
  surname: string;
  occupation: string;
  profilePic: string;
  occupationStartDate: Date;
  email: string;
}


@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
  private _router = inject(Router);

  user: WritableSignal<User> = signal({
    firstname: "vorname",
    email: "vorname@gmail.com",
    surname: "nachname",
    occupation: "carer",
    occupationStartDate: new Date(5),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  })

  editDetails() {
    this._router.navigate(['/profile/user-details/edit']);
  }

  experienceDuration(occupationStartDate: Date) {
    const currentDate = new Date();
    return formatDistance(
      occupationStartDate,
      currentDate
    );
  }

}

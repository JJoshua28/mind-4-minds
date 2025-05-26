import {Component, inject, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";

export interface User {
  firstname: string;
  surname: string;
  occupation: string;
  profilePic: string;
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
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  })

  editDetails() {
    this._router.navigate(['/profile/user-details/edit']);
  }

}

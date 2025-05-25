import {Component, signal, WritableSignal} from '@angular/core';

export interface User {
  firstname: string;
  surname: string;
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
  user: WritableSignal<User> = signal({
    firstname: "vorname",
    email: "vorname@gmail.com",
    surname: "nachname",
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  })

}

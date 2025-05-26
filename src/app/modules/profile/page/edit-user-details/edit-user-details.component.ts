import {Component, inject, signal, WritableSignal} from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {User} from "../../components/user-details/user-details.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './edit-user-details.component.html',
  styleUrl: './edit-user-details.component.scss'
})
export class EditUserDetailsComponent {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  user = {
    firstname: "vorname",
    email: "vorname@gmail.com",
    lastName: "nachname",
    occupation: "carer",
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  }

  userDetails = this._formBuilder.group({
    firstName: ["", [Validators.required]],
    lastName: [this.user.lastName, [Validators.required]],
    occupation: [this.user.occupation, [Validators.required]],
    profilePic: [this.user.profilePic, []],
    email: [this.user.email, [Validators.required, Validators.email]],
    currentPassword: [""],
    newPassword : [""]

  });

  navigateTo() {
    this._router.navigate(['/profile/user-details']);
  }

}

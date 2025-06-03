import {Component, inject } from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {DateInputComponent} from "../../../../shared/component/date-input/date-input.component";
import {format} from "date-fns";

@Component({
  selector: 'app-edit-user-details',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    DateInputComponent
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
    occupationStartDate: new Date(),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg"
  }

  formattedDate = format(this.user.occupationStartDate, 'yyyy-MM-dd');


  userDetails = this._formBuilder.group({
    firstName: ["", [Validators.required]],
    lastName: [this.user.lastName, [Validators.required]],
    occupation: [this.user.occupation, [Validators.required]],
    occupationStartDate: [this.formattedDate],
    profilePic: [this.user.profilePic, []],
    email: [this.user.email, [Validators.required, Validators.email]],
    currentPassword: [""],
    newPassword : [""]

  });

  navigateTo() {
    this._router.navigate(['/profile/user-details']);
  }

}

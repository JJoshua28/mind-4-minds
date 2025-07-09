import {Component, inject, signal } from '@angular/core';

import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

import { UserFormControls} from "../../../../types/user details/user-form.interface";
import {UserType} from "../../../../types/user-type.enum";

import {RegistrationService, RegistrationUserDetails} from "../../registration.service";

import {EditUserDetailsComponent} from "../../../../shared/component/edit-user-details/edit-user-details.component";
import {environment} from "../../../../../environments/environment";

@Component({
  selector: 'app-register-user-details-page',
  standalone: true,
  imports: [
    EditUserDetailsComponent
  ],
  templateUrl: './register-user-details-page.component.html',
  styleUrl: './register-user-details-page.component.scss'
})
export class RegisterUserDetailsPageComponent {
  private readonly _formBuilder = inject(FormBuilder);

  registrationService: RegistrationService =inject(RegistrationService);

  private readonly defaultProfilePic = environment.defaultProfilePic;

  $profilePicToPreview = signal(this.registrationService.userDetails()?.storageProfilePic || this.defaultProfilePic);

  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  userDetailsForm: FormGroup<UserFormControls> = this._formBuilder.group({
    firstName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails()?.firstName || '', [Validators.required, Validators.minLength(2)]
    ),
    lastName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails()?.lastName || '', [Validators.required,  Validators.minLength(2)]
    ),
    occupation: this._formBuilder.control(
      this.registrationService?.userDetails()?.occupation ||'', Validators.minLength(2)
    ),
    occupationStartDate: this._formBuilder.control(
      this.registrationService?.userDetails()?.occupationStartDate || null
    ),
    profilePic: this._formBuilder.control<File | null>(null,
      this.registrationService?.roles.includes(UserType.MENTOR) && !this.$profilePicToPreview()
        ? Validators.required
        : []
    ),
    email: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails()?.email || '', [Validators.required, Validators.email]
    ),
    currentPassword: this._formBuilder.control<string | null >('', []) as FormControl<string | null>,
    newPassword: this._formBuilder.control<string | null>(
      this.registrationService?.userDetails()?.newPassword || '', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex)
      ]
    )
  });

  submitUserDetails() {
    if(this.userDetailsForm.valid) {
      const { currentPassword, ...details } = this.userDetailsForm.value as { currentPassword: string | null } & RegistrationUserDetails;
      this.registrationService.addUserDetails(details);
    }
  }

  navigateToNextSection() {
    this.registrationService.navigateToNextSection()
  }
}

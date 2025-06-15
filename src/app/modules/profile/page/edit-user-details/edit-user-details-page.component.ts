import {Component, inject } from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from "@angular/forms";
import {Router} from "@angular/router";
import {DateInputComponent} from "../../../../shared/component/date-input/date-input.component";

import {EditUserDetailsComponent} from "../../../../shared/component/edit-user-details/edit-user-details.component";
import {
  UserFormControls
} from "../../../../types/user details/userForm.interface";

import {RegistrationService} from "../../../register/registration.service";

@Component({
  selector: 'app-edit-user-details-page',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    DateInputComponent,
    EditUserDetailsComponent
  ],
  templateUrl: './edit-user-details-page.component.html',
  styleUrl: './edit-user-details-page.component.scss'
})
export class EditUserDetailsPageComponent {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly changeType = "edit";

  registrationService: RegistrationService = inject(RegistrationService);

  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  userDetailsForm: FormGroup<UserFormControls> = this._formBuilder.group({
    firstName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.firstName || '', [Validators.required, Validators.minLength(2)]
    ),
    lastName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.lastName || '', [Validators.required, Validators.minLength(2)]
    ),
    occupation: this._formBuilder.control(
      this.registrationService?.userDetails?.occupation ||'', Validators.minLength(2)
    ),
    occupationStartDate: this._formBuilder.control(
      this.registrationService?.userDetails?.occupationStartDate || ''
    ),
    profilePic: this._formBuilder.control<File | null>(
      this.registrationService?.userDetails?.profilePic || null,
    ),
    email: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.email || '', [Validators.required, Validators.email]
    ),
    currentPassword: this._formBuilder.control<string | null >('', []) as FormControl<string | null>,
    newPassword: this._formBuilder.control<string | null>(
      this.registrationService?.userDetails?.newPassword || '', [
        Validators.minLength(6),
        Validators.pattern(this.passwordRegex)
      ]
    )
  }, {validators: this.currentPasswordRequiredIfNewPassword() });

  currentPasswordRequiredIfNewPassword(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const currentPassword = group.get('currentPassword')?.value;
      const newPassword = group.get('newPassword')?.value;

      if (newPassword && !currentPassword) {
        return { currentPasswordRequired: true };
      }
      return null;
    };
  }

  navigateTo() {
    this._router.navigate(['/profile/user-details']);
  }

}

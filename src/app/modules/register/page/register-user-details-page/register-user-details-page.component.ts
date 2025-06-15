import {Component, inject} from '@angular/core';
import {EditUserDetailsComponent} from "../../../../shared/component/edit-user-details/edit-user-details.component";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {RegistrationService, RegistrationUserDetails} from "../../registration.service";
import {UserType} from "../../../../types/user-type.enum";
import { UserFormControls} from "../../../../types/user details/userForm.interface";
import {Router} from "@angular/router";

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
  private readonly _router = inject(Router);

  registrationService: RegistrationService =inject(RegistrationService);

  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  userDetailsForm: FormGroup<UserFormControls> = this._formBuilder.group({
    firstName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.firstName || '', [Validators.required, Validators.minLength(2)]
    ),
    lastName: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.lastName || '', [Validators.required,  Validators.minLength(2)]
    ),
    occupation: this._formBuilder.control(
      this.registrationService?.userDetails?.occupation ||'', Validators.minLength(2)
    ),
    occupationStartDate: this._formBuilder.control(
      this.registrationService?.userDetails?.occupationStartDate || ''
    ),
    profilePic: this._formBuilder.control<File | null>(
      this.registrationService?.userDetails?.profilePic || null,
      this.registrationService?.roles.includes(UserType.MENTOR)
        ? Validators.required
        : []
    ),
    email: this._formBuilder.nonNullable.control(
      this.registrationService?.userDetails?.email || '', [Validators.required, Validators.email]
    ),
    currentPassword: this._formBuilder.control<string | null >('', []) as FormControl<string | null>,
    newPassword: this._formBuilder.control<string | null>(
      this.registrationService?.userDetails?.newPassword || '', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(this.passwordRegex)
      ]
    )
  });

  submitUserDetails() {
    if(this.userDetailsForm.valid) {
      const details = this.userDetailsForm.value as RegistrationUserDetails;
      this.registrationService.addUserDetails(details);
    }
  }

  navigateToMenteeDetails() {
    const menteeDetailsRegistrationUrl = "login"
    this.userDetailsForm.valid && this._router.navigate([menteeDetailsRegistrationUrl]);
  }
}

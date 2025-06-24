import {Component, computed, inject, OnInit, signal, Signal} from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {
  AbstractControl, AsyncValidatorFn,
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
} from "../../../../types/user details/user-form.interface";

import {RegistrationService} from "../../../register/registration.service";
import {UserService} from "../../../../shared/services/user/user-service.service";
import {UserDetails} from "../../../../types/user.interface";
import {toSignal} from "@angular/core/rxjs-interop";
import {HttpService} from "../../../../shared/services/http.service";
import {catchError, delay, map, Observable, of, take} from "rxjs";
import {UserAccountDetails, UserAccountPayload} from "../../../../types/api/user-account .interface";
import {UserDetailsUpdateRequest} from "../../../../types/api/user-details.interface";

@Component({
  selector: 'app-edit-user-details-page',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule,
    DateInputComponent,
    EditUserDetailsComponent
  ],
  providers: [
    UserService,
  ],
  templateUrl: './edit-user-details-page.component.html',
  styleUrl: './edit-user-details-page.component.scss'
})
export class EditUserDetailsPageComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly changeType = "edit";

  private readonly userDetailsService: UserService = inject(UserService);
  private readonly _httpService = inject(HttpService);

  $userDetails!: Signal<UserDetails>;

  $profilePic = computed(() => { return this.$userDetails()?.profilePic || "/assets/images/default.jpeg"})

  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  userDetailsForm!: FormGroup<UserFormControls>;

  ngOnInit() {

    this.userDetailsService.userDetails().subscribe(
      userDetails => {
        this.$userDetails = signal(userDetails)

        this.userDetailsForm = this._formBuilder.group({
          firstName: this._formBuilder.nonNullable.control(
            this.$userDetails()?.firstName || '', [Validators.required, Validators.minLength(2)]
          ),
          lastName: this._formBuilder.nonNullable.control(
            this.$userDetails()?.lastName || '', [Validators.required, Validators.minLength(2)]
          ),
          occupation: this._formBuilder.control(
            this.$userDetails()?.occupation ||'', Validators.minLength(2)
          ),
          occupationStartDate: this._formBuilder.control(
            this.$userDetails()?.occupationStartDate || ''
          ),
          profilePic: this._formBuilder.control<File | null>(null,
          ),

          email: this._formBuilder.nonNullable.control(
            this.$userDetails()?.email || '', [Validators.required, Validators.email]
          ),
          currentPassword: this._formBuilder.control<string | null >('', {
            asyncValidators: this.isCorrectPassword(),
          }) as FormControl<string | null>,
          newPassword: this._formBuilder.control<string | null>('', [
              Validators.minLength(6),
              Validators.pattern(this.passwordRegex)
            ]
          )
        }, {validators: this.currentPasswordRequiredIfNewPassword() })
      }


    )




  }

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

  isCorrectPassword(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const currentPassword = control.value;
      if (!currentPassword) return of(null);

      const tokenEndpoint = 'token';

      return this._httpService.post(tokenEndpoint, {
        password: currentPassword,
        email: this.$userDetails().email
      }).pipe(
        delay(500),
        take(1),
        map(() => null),
        catchError(() => of({ incorrectPassword: true })) // Invalid password
      );
    };

  }

  submitUpdate() {
    if(this.userDetailsForm.valid) {
      const { email, newPassword: password, currentPassword, ...rest } = this.userDetailsForm.value;

      if(email || password) {
        const updates:UserAccountDetails = {
          email: email || this.$userDetails().email,
          isArchived: !this.$userDetails().isArchived,
        }
        if(password) updates.password = password;

        this.userDetailsService.updateUserAccount(updates).subscribe();
      }

      if(rest) {
        const roles = this.$userDetails().roles

        const request = {
          ...rest,
          roles: roles
        } as UserDetailsUpdateRequest;

        this.userDetailsService.updateUserDetails(request).subscribe();
      }
    }
  }

  navigateTo() {
    this._router.navigate(['/profile/user-details']);
  }

}

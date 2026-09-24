import {Component, computed, inject, input, OnInit, signal, WritableSignal} from '@angular/core';

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

import {EditUserDetailsComponent} from "../../../../shared/component/edit-user-details/edit-user-details.component";
import {
  UserFormControls
} from "../../../../types/user details/user-form.interface";

import {UserService} from "../../../../shared/services/user/user-service.service";

import {HttpService} from "../../../../shared/services/http.service";
import {catchError, delay, map, Observable, of, take, tap} from "rxjs";
import {UserAccountDetails} from "../../../../types/api/user-account .interface";
import {UserRepository} from "../../../../shared/repositories/user.repository";
import {environment} from "../../../../../environments/environment";
import {UserInfo} from "../../../../types/user details/user-info.interface";


@Component({
  selector: 'app-edit-user-details-page-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditUserDetailsComponent
  ],
  templateUrl: './edit-user-details-page.component.html',
  styleUrl: './edit-user-details-page.component.scss'
})
export class EditUserDetailsPageComponent implements OnInit {
  private readonly _router = inject(Router);
  private readonly _formBuilder = inject(FormBuilder);

  private readonly _httpService = inject(HttpService);
  private readonly _userRepository = inject(UserRepository);
  private readonly _userService = inject(UserService);

  private readonly defaultProfilePic = environment.defaultProfilePic;

  accountID = input.required<string>();
  changeType = input<"admin" | "user">("user");

  $accountInfo!: WritableSignal<UserInfo>;

  $isReady = signal(false);

  $profilePic = computed(() => { return this.$accountInfo()?.profilePic || this.defaultProfilePic})

  passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/;

  userDetailsForm!: FormGroup<UserFormControls>;

  ngOnInit() {
    this._userRepository.getUserDetailsById(this.accountID() as string).pipe(
      take(1)
    ).subscribe(
      userDetails => {
        this.$accountInfo = signal(userDetails);

        this.userDetailsForm = this._formBuilder.group({
          firstName: this._formBuilder.nonNullable.control(
            this.$accountInfo()?.firstName || '', [Validators.required, Validators.minLength(2)]
          ),
          lastName: this._formBuilder.nonNullable.control(
            this.$accountInfo()?.lastName || '', [Validators.required, Validators.minLength(2)]
          ),
          occupation: this._formBuilder.control(
            this.$accountInfo()?.occupation ||'', Validators.minLength(2)
          ),
          occupationStartDate: this._formBuilder.control(
            this.$accountInfo()?.occupationStartDate || ''
          ),
          profilePic: this._formBuilder.control<File | null>(null,
          ),

          email: this._formBuilder.nonNullable.control(
            this.$accountInfo()?.email || '', [Validators.required, Validators.email]
          ),
          currentPassword: this._formBuilder.control<string | null >('', {
            asyncValidators: this.isCorrectPassword(),
          }) as FormControl<string | null>,
          newPassword: this._formBuilder.control<string | null>('', [
              Validators.minLength(6),
              Validators.pattern(this.passwordRegex)
            ]
          )
        }, this.changeType() === "admin" ? {} : {validators: this.currentPasswordRequiredIfNewPassword() })

        this.$isReady.set(true);
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
        email: this.$accountInfo().email
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
          email: email || this.$accountInfo().email,
          isAdmin: this.$accountInfo().isAdmin,
          isArchived: this.$accountInfo().isArchived,
        }
        if(password) updates.password = password;

        this._userRepository.updateUserAccount(updates,this.$accountInfo().id).pipe(
          take(1)
        ).subscribe();
      }

      if(rest) {
        const roles = this.$accountInfo().roles

        const request = {
          ...rest,
          roles: roles
        } as Partial<UserInfo>;

        this._userRepository.updateUserAccount(request, this.$accountInfo().id).pipe(
          take(1),
          tap((user) => {
            if(this._userService.$userAccount().id === this.accountID())
            {
              this._userService.updateData(user);
            }
          })
        ).subscribe(() => {
          this.navigateToDetails();
        });
      }
    }
  }

  navigateToDetails () {
    this._router.navigate([`/user-details/${this.accountID()}`]);
  }

}

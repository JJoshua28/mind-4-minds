import {Component, inject} from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpService} from "../../../../shared/services/http.service";
import {LocalStorageService} from "../../../../shared/services/local-storage.service";
import {AuthServiceService, AuthToken} from "../../../../shared/services/auth-service.service";
import {UserType} from "../../../../types/user-type.enum";
import {UserServiceService} from "../../../../shared/services/user/user-service.service";
import {take} from "rxjs";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    TextInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  protected readonly _router: Router = inject(Router);
  private readonly _formBuilder: FormBuilder = inject(FormBuilder);

  private readonly _apiService = inject(HttpService);
  private readonly _authService = inject(AuthServiceService);
  private readonly _localStorageService = inject(LocalStorageService);
  private readonly _userService = inject(UserServiceService);

  protected errorMessage!: string | null;

  loginCredentials: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  navigateTo() {
    this._router.navigate(['my-mentees']);
  }

  navigateToLandingPage(roles: UserType[]) {
    let landingPage = ""

    if (roles.includes(UserType.MENTEE)) {
      landingPage = "my-mentors"
    } else if (roles.includes(UserType.MENTOR)) {
      landingPage = "my-mentees"
    } else {
      landingPage = "users"
    }

    this._router.navigate([`/${landingPage}`]);
  }

  navigateToRegistration () {
    this._router.navigate(['register']);
  }

  getAuthenticationToken (email: string, password: string)  {
      const endpoint = "token"
      return this._apiService.post(endpoint, {email, password})
  }

  onSubmit() {
    if (this.loginCredentials.invalid) return;

    const { email, password } = this.loginCredentials.value;
    this.loginCredentials.markAsUntouched();

    this.getAuthenticationToken(email, password).subscribe({
      next: (response) => {
        const { access, refresh, user_id } = response as AuthToken;

        this._authService.setAccessToken(access);
        this._authService.setRefreshToken(refresh);
        this._localStorageService.setItem('user_id', user_id);

        this._userService.userDetails().pipe(take(1)).subscribe({
          next: (userDetails) => {
            this.navigateToLandingPage(userDetails.roles);
          }
        });
      },
      error: (error: any) => {
        if(error?.error?.non_field_errors) {
          this.errorMessage = error.error.non_field_errors;
        }
        else if (error?.error?.detail) {
          this.errorMessage = error.error.detail;
        } else if (error?.message) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    });
  }
}

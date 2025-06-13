import {Component, inject} from '@angular/core';
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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

  loginCredentials: FormGroup = this._formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  })

  navigateTo() {
    this._router.navigate(['my-mentees']);
  }

}

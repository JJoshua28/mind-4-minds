import {Component, inject} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-registration-layout-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextInputComponent,
    RouterOutlet
  ],
  templateUrl: './registration-layout-page.component.html',
  styleUrl: './registration-layout-page.component.scss'
})
export class RegistrationLayoutPageComponent {
  private readonly _router: Router = inject(Router);

  registrationOrder: string[] =  [
    "login",
    "/register/roles"
  ]

  navigateBack() {
    const currentRouteIndex = this.registrationOrder.indexOf(this._router.url)
    this._router.navigate(
      [this.registrationOrder[currentRouteIndex -1]]
    );
  }

}

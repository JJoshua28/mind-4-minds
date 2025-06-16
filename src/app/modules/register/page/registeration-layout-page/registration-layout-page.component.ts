import {Component, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router, RouterOutlet} from "@angular/router";
import {RegistrationService} from "../../registration.service";

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
export class RegistrationLayoutPageComponent implements OnInit {
  private readonly _router: Router = inject(Router);
  private readonly registrationService: RegistrationService = inject(RegistrationService);

  registrationOrder: string[] =  [
    "login",
    "/register/roles",
    "/register/user-details",
    "/register/mentee-details",
  ]

  ngOnInit() {
    // const rolesURI = "/register/roles";
    // const canSelectARole = this._router.url === rolesURI;
    // if (!canSelectARole && this.registrationService.roles.length < 1 ) {
    //   this._router.navigate([rolesURI]);

//    }
  }

  navigateBack() {
    const currentRouteIndex = this.registrationOrder.indexOf(this._router.url)
    this._router.navigate(
      [this.registrationOrder[currentRouteIndex -1]]
    );
  }

}

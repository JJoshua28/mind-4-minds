import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router, RouterOutlet} from "@angular/router";
import {RegistrationService} from "../../registration.service";
import {Subscription} from "rxjs";

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
export class RegistrationLayoutPageComponent implements OnInit, OnDestroy {
  private readonly _router: Router = inject(Router);
  private readonly subscriptions: Subscription = new Subscription();
  private readonly registrationService: RegistrationService = inject(RegistrationService);

  registrationOrder: string[] =  [
    "login",
    "/register/roles",
    "/register/user-details",
    "/register/mentee-details",
    "/register/mentor-details"
  ]

  ngOnInit() {
    // const rolesURI = "/register/roles";
    // const canSelectARole = this._router.url === rolesURI;
    // if (!canSelectARole && this.registrationService.roles.length < 1 ) {
    //   this._router.navigate([rolesURI]);

//    }
    this.subscriptions.add(this.registrationService.sectionNavigationObserver().subscribe(() => {
      this.navigateToNextSection();
    }))
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  navigateToNextSection () {
    const currentRouteIndex = this.registrationOrder.indexOf(this._router.url)
    const nextIndex = currentRouteIndex === this.registrationOrder.length -1? 0 : currentRouteIndex + 1;

    this._router.navigate(
      [this.registrationOrder[nextIndex]]
    );

  }

  navigateBack() {
    const currentRouteIndex = this.registrationOrder.indexOf(this._router.url)
    this._router.navigate(
      [this.registrationOrder[currentRouteIndex -1]]
    );
  }

}

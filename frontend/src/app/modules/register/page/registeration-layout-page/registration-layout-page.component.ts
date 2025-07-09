import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {ReactiveFormsModule} from "@angular/forms";
import {TextInputComponent} from "../../../../shared/component/text-input/text-input.component";
import {Router, RouterOutlet} from "@angular/router";
import {RegistrationService} from "../../registration.service";
import {Subscription} from "rxjs";
import {UserType} from "../../../../types/user-type.enum";
import {environment} from "../../../../../environments/environment";

@Component({
selector: 'app-registration-layout-page',
standalone: true,
imports: [
  ReactiveFormsModule,
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
    "/register/user-details-page",
    "/register/review-registration"
  ]

  userRegistrationOrder: string[] =  [
    "login",
    "/register/roles",
  ]

  protected readonly logo = environment.logo;

  ngOnInit() {
  if(this.registrationService.roles.length > 0) {
    this.createRegistrationSteps(this.registrationService.roles);
  }

  this.subscriptions.add(this.registrationService.registrationCompleteObserver().subscribe((roles) => {
    this.navigateToLandingPage(roles);
  }))

  this.subscriptions.add(this.registrationService.sectionNavigationObserver().subscribe(() => {
    this.createRegistrationSteps(this.registrationService.roles);
    this.navigateToNextSection();
  }))

}

ngOnDestroy() {
  this.subscriptions.unsubscribe();
}

mapUserTypeToRegistrationRoute (userType: UserType) {
  switch (userType) {
    case UserType.MENTEE:
      return "/register/mentee";
    case UserType.MENTOR:
      return "/register/mentor-details";
    default:
      return "";
  }

}

createRegistrationSteps (userRoles: UserType[]) {
  const roleRoutes = userRoles.map(role => this.mapUserTypeToRegistrationRoute(role)).filter(route => route);
  const registrationProcess = [...this.registrationOrder];
  const lastStep = registrationProcess.pop();

  this.userRegistrationOrder = [
    ...registrationProcess,
    ...roleRoutes,
    lastStep as string
  ]

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

navigateToNextSection () {

  const currentRouteIndex = this.userRegistrationOrder.indexOf(this._router.url)
  const nextIndex = currentRouteIndex === this.userRegistrationOrder.length -1? 0 : currentRouteIndex + 1;

  this._router.navigate(
    [this.userRegistrationOrder[nextIndex]]
  );

}

navigateBack() {
  const currentRouteIndex = this.userRegistrationOrder.indexOf(this._router.url)
  this._router.navigate(
    [this.userRegistrationOrder[currentRouteIndex -1]]
  );
}

}

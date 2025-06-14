import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationLayoutPageComponent } from './registration-layout-page.component';
import {RouterTestingModule} from "@angular/router/testing";
import {Router} from "@angular/router";
import {LoginPageComponent} from "../../../login/page/login-page/login-page.component";
import {RolesComponent} from "../roles/roles.component";
import {ReactiveFormsModule} from "@angular/forms";

describe('RegistrationLayoutPageComponent', () => {
  let fixture: ComponentFixture<RegistrationLayoutPageComponent>;
  let component: RegistrationLayoutPageComponent;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegistrationLayoutPageComponent,
        LoginPageComponent,
        RolesComponent,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([
          { path: 'login', component: LoginPageComponent },
          { path: 'register/roles', component: RolesComponent }
        ])
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegistrationLayoutPageComponent);
    component = fixture.componentInstance;

    await router.navigateByUrl('/register/roles'); // Set current route
    fixture.detectChanges();
  });

  it('should navigate back to /login from /register/roles', async () => {
    component.navigateBack();
    await fixture.whenStable();
    expect(router.url).toBe('/login');
  });
});

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { EditUserDetailsPageComponent } from './edit-user-details-page.component';
import {RegistrationService} from "../../../register/registration.service";


describe('EditUserDetailsPageComponent (Standalone, Jest)', () => {
  let component: EditUserDetailsPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditUserDetailsPageComponent], // Standalone component import
      providers: [
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: RegistrationService,
          useValue: {
            userDetails: {
              firstName: 'Jane',
              lastName: 'Doe',
              occupation: 'Engineer',
              occupationStartDate: '2022-01-01',
              profilePic: null,
              email: 'jane@example.com',
              newPassword: ''
            },
            roles: []
          }
        }
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(EditUserDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should not return error when no new password is entered', () => {
    const form = component.userDetailsForm;
    form.get('newPassword')?.setValue('');
    form.get('currentPassword')?.setValue('');
    expect(form.errors).toBeNull();
  });

  it('should return error if new password is set but current password is empty', () => {
    const form = component.userDetailsForm;
    form.get('newPassword')?.setValue('StrongPass123!');
    form.get('currentPassword')?.setValue('');
    expect(form.errors).toEqual({ currentPasswordRequired: true });
  });

  it('should not return error if both new password and current password are set', () => {
    const form = component.userDetailsForm;
    form.get('newPassword')?.setValue('StrongPass123!');
    form.get('currentPassword')?.setValue('OldPass123');
    expect(form.errors).toBeNull();
  });
});

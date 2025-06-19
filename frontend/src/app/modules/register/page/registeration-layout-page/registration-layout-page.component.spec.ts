import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { RegistrationLayoutPageComponent } from './registration-layout-page.component';
import { UserType } from '../../../../types/user-type.enum';

describe('RegistrationLayoutPageComponent', () => {
  let component: RegistrationLayoutPageComponent;
  let fixture: ComponentFixture<RegistrationLayoutPageComponent>;
  let mockRouter: any;
  let mockRegistrationService: any;

  beforeEach(() => {
    mockRouter = {
      url: '/register/user-details',
      navigate: jest.fn()
    };

    mockRegistrationService = {
      roles: [UserType.MENTEE],
      sectionNavigationObserver: jest.fn(() => of(null))
    };

    TestBed.configureTestingModule({
      imports: [RegistrationLayoutPageComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: 'RegistrationService', useValue: mockRegistrationService }
      ]
    });

    fixture = TestBed.createComponent(RegistrationLayoutPageComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  it('should map MENTEE role correctly', () => {
    expect(component.mapUserTypeToRegistrationRoute(UserType.MENTEE)).toBe('/register/mentee-details');
  });

  it('should map MENTOR role correctly', () => {
    expect(component.mapUserTypeToRegistrationRoute(UserType.MENTOR)).toBe('/register/mentor-details');
  });

  it('should return empty string for admin user type', () => {
    expect(component.mapUserTypeToRegistrationRoute('' as UserType)).toBe('');
  });

  it('should create correct userRegistrationOrder', () => {
    component.createRegistrationSteps([UserType.MENTEE, UserType.MENTOR]);
    expect(component.userRegistrationOrder).toContain('/register/mentee-details');
    expect(component.userRegistrationOrder).toContain('/register/mentor-details');
    expect(component.userRegistrationOrder[0]).toBe('login');
    expect(component.userRegistrationOrder.at(-1)).toBe('/register/review-registration');
  });

  it('should navigate to the next section', () => {
    component.userRegistrationOrder = [
      'login',
      '/register/roles',
      '/register/user-details',
    ];
    mockRouter.url = '/register/roles';
    component.navigateToNextSection();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register/user-details']);
  });

  it('should navigate back to previous section', () => {
    component.userRegistrationOrder = [
      'login',
      '/register/roles',
      '/register/user-details',
    ];
    mockRouter.url = '/register/user-details';
    component.navigateBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register/roles']);
  });
});

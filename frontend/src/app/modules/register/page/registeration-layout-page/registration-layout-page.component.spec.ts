import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { RegistrationLayoutPageComponent } from './registration-layout-page.component';
import { UserType } from '../../../../types/user-type.enum';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RegistrationService } from '../../registration.service';

describe('RegistrationLayoutPageComponent', () => {
  let component: RegistrationLayoutPageComponent;
  let fixture: ComponentFixture<RegistrationLayoutPageComponent>;
  let mockRouter: any;
  let mockRegistrationService: any;
  let sectionNavigationSubject: Subject<void>;
  let registrationCompleteSubject: Subject<UserType[]>;

  beforeEach(() => {
    sectionNavigationSubject = new Subject<void>();
    registrationCompleteSubject = new Subject<UserType[]>();

    mockRouter = {
      url: '/register/user-details',
      navigate: jest.fn()
    };

    mockRegistrationService = {
      roles: [UserType.MENTEE],
      sectionNavigationObserver: jest.fn(() => sectionNavigationSubject.asObservable()),
      registrationCompleteObserver: jest.fn(() => registrationCompleteSubject.asObservable()),
    };

    TestBed.configureTestingModule({
      imports: [RegistrationLayoutPageComponent, HttpClientTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegistrationService, useValue: mockRegistrationService },
      ],
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

  it('should return empty string for unknown user type', () => {
    expect(component.mapUserTypeToRegistrationRoute('' as UserType)).toBe('');
  });

  it('should create correct userRegistrationOrder with roles', () => {
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


  it('should redirect to roles page if current URL not in userRegistrationOrder', () => {
    mockRouter.url = '/register/unknown-page';
    mockRegistrationService.roles = [];
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register/roles']);
  });

  it('should redirect to roles page if roles are empty and not on roles page', () => {
    mockRouter.url = '/register/user-details';
    mockRegistrationService.roles = [];
    component.ngOnInit();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/register/roles']);
  });

  it('should set userRegistrationOrder based on roles on init', () => {
    mockRegistrationService.roles = [UserType.MENTEE];
    component.ngOnInit();
    expect(component.userRegistrationOrder).toContain('/register/mentee-details');
  });


  it('should subscribe to registrationCompleteObserver and navigate to landing page', () => {
    component.ngOnInit();

    registrationCompleteSubject.next([UserType.MENTEE]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-mentors']);

    registrationCompleteSubject.next([UserType.MENTOR]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/my-mentees']);

    registrationCompleteSubject.next([]);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/users']);
  });


  it('should unsubscribe subscriptions on destroy', () => {
    component.ngOnInit();

    const spy = jest.spyOn(component['subscriptions'], 'unsubscribe');

    component.ngOnDestroy();

    expect(spy).toHaveBeenCalled();
  });

});

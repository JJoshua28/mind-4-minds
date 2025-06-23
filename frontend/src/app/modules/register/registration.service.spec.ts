import { TestBed } from '@angular/core/testing';
import { RegistrationService } from './registration.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { HttpService } from '../../shared/services/http.service';
import { of } from 'rxjs';
import { UserType } from '../../types/user-type.enum';

describe('RegistrationService', () => {
  let service: RegistrationService;
  let localStorageServiceSpy: jest.Mocked<LocalStorageService>;
  let httpServiceSpy: jest.Mocked<HttpService>;

  beforeEach(() => {
    localStorageServiceSpy = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      clear: jest.fn(),
    } as unknown as jest.Mocked<LocalStorageService>;

    httpServiceSpy = {
      post: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    TestBed.configureTestingModule({
      providers: [
        RegistrationService,
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: HttpService, useValue: httpServiceSpy },
      ],
    });

    service = TestBed.inject(RegistrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store roles and update local storage', () => {
    const roles: UserType[] = [UserType.MENTEE];
    service.addRoles(roles);
    expect(service.roles).toEqual(roles);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('roles', roles);
  });

  it('should store user details', () => {
    const details = {
      email: 'test@example.com',
      newPassword: 'pass123',
    } as any;

    service.addUserDetails(details);

    const {profilePic, ...userDetails} = details;

    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith('userDetails', userDetails);
  });

  it('should emit navigation event', (done) => {
    service.sectionNavigationObserver().subscribe(() => {
      expect(true).toBe(true);
      done();
    });

    service.navigateToNextSection();
  });
});

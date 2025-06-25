import { TestBed } from '@angular/core/testing';
import { HttpService } from '../http.service';
import { LocalStorageService } from '../local-storage.service';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserAccount, UserAccountDetails } from '../../../types/api/user-account .interface';
import { ApiUserDetails } from '../../../types/api/user-details.interface';
import { UserDetailsUpdateRequest } from '../../../types/api/user-details.interface';
import { UserType } from '../../../types/user-type.enum';
import {UserService} from "./user-service.service";

jest.mock('@angular/router');

describe('UserService', () => {
  let service: UserService;
  let httpService: jest.Mocked<HttpService>;
  let router: jest.Mocked<Router>;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let authService: jest.Mocked<AuthServiceService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: HttpService, useValue: { get: jest.fn(), put: jest.fn() } },
        { provide: LocalStorageService, useValue: { getItem: jest.fn() } },
        { provide: AuthServiceService, useValue: { getAccessToken: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn(), url: '/' } }
      ]
    });

    service = TestBed.inject(UserService);
    httpService = TestBed.inject(HttpService) as any;
    router = TestBed.inject(Router) as any;
    localStorageService = TestBed.inject(LocalStorageService) as any;
    authService = TestBed.inject(AuthServiceService) as any;

    localStorageService.getItem.mockReturnValue('test-user-id');
  });

  it('should fetch user details', (done) => {
    const account: UserAccount = { id: '1', details: '99' } as any;
    const details: ApiUserDetails = { name: 'Test' } as any;

    httpService.get.mockImplementation((url) => {
      if (url.includes('accounts')) return of(account);
      if (url.includes('details')) return of(details);
      return of({});
    });


    service.userDetails().subscribe((result) => {
      expect(result).toBeDefined();
      expect(httpService.get).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should update user account', (done) => {
    const payload: UserAccountDetails = { email: 'test@test.com' } as any;
    httpService.put.mockReturnValue(of({ success: true }));

    service.updateUserAccount(payload).subscribe((result) => {
      expect(httpService.put).toHaveBeenCalledWith(expect.stringContaining('accounts'), expect.anything());
      done();
    });
  });

  it('should fetch user info', (done) => {
    const account: UserAccount = { id: '1', details: '999' } as any;
    const details: ApiUserDetails = { name: 'User' } as any;

    httpService.get.mockImplementation((url) => {
      if (url.includes('accounts')) return of(account);
      if (url.includes('details')) return of(details);
      return of({});
    });

    service.userInfo().subscribe((info) => {
      expect(info).toBeDefined();
      expect(httpService.get).toHaveBeenCalledTimes(2);
      done();
    });
  });

  it('should create user details form data', () => {
    const request: UserDetailsUpdateRequest = {
      firstName: 'Jane',
      lastName: 'Doe',
      roles: [UserType.MENTOR],
      occupation: null,
      occupationStartDate: null
    };

    const formData = service.createUserDetailsRequest(request, request.roles);
    expect(formData.has('first_name')).toBe(true);
    expect(formData.has('last_name')).toBe(true);
    expect(formData.has('roles')).toBe(true);
  });

  it('should fetch all user details and map them', (done) => {
    const apiDetails: ApiUserDetails[] = [
      { user_account: { id: '1' }, name: 'Alice' },
      { user_account: { id: '2' }, name: 'Bob' }
    ] as any;

    httpService.get.mockReturnValue(of(apiDetails));

    service.getAllUserDetails().subscribe((result) => {
      expect(httpService.get).toHaveBeenCalledWith('users/details');
      expect(result.length).toBe(2);
      done();
    });
  });

  it('should navigate to login if unauthorized in ngOnInit', () => {
    localStorageService.getItem.mockReturnValue(null);
    authService.getAccessToken.mockReturnValue(null);

    service.ngOnInit();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });


});

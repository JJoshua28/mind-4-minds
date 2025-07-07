import { TestBed } from '@angular/core/testing';
import { UserService } from './user-service.service';
import { LocalStorageService } from '../local-storage.service';
import { Router } from '@angular/router';
import { UserRepository } from '../../repositories/user.repository';
import { of, Subject } from 'rxjs';
import { UserDetails } from '../../../types/user.interface';
import { ApiUserDetails } from '../../../types/api/user-details.interface';

jest.mock('@angular/router');

describe('UserService', () => {
  let service: UserService;
  let localStorageService: jest.Mocked<LocalStorageService>;
  let userRepository: jest.Mocked<UserRepository>;
  let router: jest.Mocked<Router>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: LocalStorageService, useValue: { getItem: jest.fn() } },
        { provide: Router, useValue: { navigate: jest.fn(), url: '/' } },
        { provide: UserRepository, useValue: { getUserDetailsByAccountId: jest.fn() } }
      ]
    });

    service = TestBed.inject(UserService);
    localStorageService = TestBed.inject(LocalStorageService) as any;
    userRepository = TestBed.inject(UserRepository) as any;
    router = TestBed.inject(Router) as any;

    localStorageService.getItem.mockReturnValue('test-user-id');
  });

  it('should initialise user from local storage if no userDetails is provided', (done) => {
    const userDetails: UserDetails = {
      id: '1',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      profilePic: '',
      occupation: '',
      occupationStartDate: '',
      roles: [],
      accountId: 'test-user-id',
      joined: '',
      isArchived: false,
      isAdmin: false
    };

    userRepository.getUserDetailsByAccountId.mockReturnValue(of(userDetails));

    const observable = service.initialiseData();

    observable.subscribe((result) => {
      expect(result).toBeDefined();
      expect(result).toEqual(userDetails);
      done();
    });
  });

  it('should set mapped userDetails immediately if provided', (done) => {
    const mockApiUserDetails: ApiUserDetails = {
      id: 'user-123',
      first_name: 'John',
      last_name: 'Doe',
      occupation: 'Engineer',
      occupation_start_date: '2020-01-01',
      profilePic: 'https://example.com/profile.jpg',
      roles: ['MENTOR', 'ADMIN'],
      user_account: {
        id: 'account-456',
        details: 'some-details',
        email: 'T4t2d@example.com',
        joined: '2022-01-01',
        is_active: true,
        is_staff: false,
      }
    };


    service.initialiseData(mockApiUserDetails).subscribe((mapped) => {
      expect(mapped.id).toBeDefined();
      expect(mapped.firstName).toBe(mockApiUserDetails.first_name);
      done();
    });
  });

  it('should update data with partial fields', () => {
    const partial: Partial<UserDetails> = { firstName: 'NewName' };

    service.$userDetails.set({
      id: '1',
      firstName: 'Old',
      lastName: 'Name',
      email: '',
      profilePic: '',
      occupation: '',
      occupationStartDate: '',
      roles: [],
      accountId: '',
      joined: '',
      isArchived: false,
      isAdmin: false
    });

    service.updateData(partial);

    expect(service.$userDetails().firstName).toBe('NewName');
  });

  it('should reload data if no partial update is provided', (done) => {
    const userDetails: UserDetails = {
      id: '1',
      firstName: 'Reload',
      lastName: 'Test',
      email: '',
      profilePic: '',
      occupation: '',
      occupationStartDate: '',
      roles: [],
      accountId: 'test-user-id',
      joined: '',
      isArchived: false,
      isAdmin: false
    };

    userRepository.getUserDetailsByAccountId.mockReturnValue(of(userDetails));

    service.updateData();

    setTimeout(() => {
      expect(service.$userDetails().firstName).toBe('Reload');
      done();
    }, 0);
  });

  it('should redirect to login on unauthorizedRedirect$', () => {
    service.unauthorizedRedirect$.next();

    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserDetailsPageComponent } from './user-details-page.component';
import { ActivatedRoute } from '@angular/router';
import { UserRepository } from '../../../../shared/repositories/user.repository';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { of, Subject } from 'rxjs';
import {CUSTOM_ELEMENTS_SCHEMA, signal} from '@angular/core';

describe('UserDetailsPageComponent', () => {
  let component: UserDetailsPageComponent;
  let fixture: ComponentFixture<UserDetailsPageComponent>;

  // jest mocks
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let userServiceMock: jest.Mocked<UserService>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  const paramsSubject = new Subject<any>();

  beforeEach(async () => {
    userRepositoryMock = {
      getUserDetailsById: jest.fn().mockReturnValue(of({
        id: 'user1',
        accountId: 'acc1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        isAdmin: false,
        joined: '',
        roles: [],
        isArchived: false,
      })),
    } as unknown as jest.Mocked<UserRepository>;

    userServiceMock = {
      $userDetails: jest.fn().mockReturnValue({
        id: 'user1',
        accountId: '',
        isAdmin: false,
        joined: '',
        roles: [],
        isArchived: false,
        firstName: '',
        lastName: '',
        email: '',
        occupation: null,
        occupationStartDate: null,
        profilePic: ''
      }),
      updateData: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    activatedRouteMock = {
      params: paramsSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [UserDetailsPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UserRepository, useValue: userRepositoryMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(UserDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to route params and load user details on init', () => {
    paramsSubject.next({ userDetailsId: 'user1' });
    expect(userRepositoryMock.getUserDetailsById).toHaveBeenCalledWith('user1');
  });

  it('should refresh user details on refreshDetails', () => {
    (component as any).userDetailsId = signal('user1');

    (component as any).userDetails = signal({
      id: 'user1',
      accountId: 'acc1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      isAdmin: false,
      joined: '',
      occupation: null,
      occupationStartDate: null,
      profilePic: '',
      roles: [],
      isArchived: false,
    });

    component.refreshDetails();

    expect(userRepositoryMock.getUserDetailsById).toHaveBeenCalledWith('user1');
    expect(userServiceMock.updateData).toHaveBeenCalled();
  });


  it('should clean up subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

});

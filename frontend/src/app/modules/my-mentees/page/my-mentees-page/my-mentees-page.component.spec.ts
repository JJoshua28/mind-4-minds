import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyMenteesPageComponent } from './my-mentees-page.component';
import { MenteeMentorLinkRepositoryService } from '../../../../shared/repositories/mentee-mentor-link.repository.service';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MyMenteesPageComponent', () => {
  let component: MyMenteesPageComponent;
  let fixture: ComponentFixture<MyMenteesPageComponent>;

  // jest mocks
  let menteeMentorLinkRepositoryMock: jest.Mocked<MenteeMentorLinkRepositoryService>;
  let userServiceMock: jest.Mocked<UserService>;

  beforeEach(async () => {
    menteeMentorLinkRepositoryMock = {
      getMentorsMenteesByUserId: jest.fn().mockReturnValue(of([
        {
          id: 'mentee1',
          accountId: 'acc1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
          isAdmin: false,
          joined: '',
          isArchived: false,
          roles: [],
          menteeDetails: {
            description: '',
            goals: [],
            learningPreferences: [],
            expectations: '',
            meetingPreferences: [],
            neurodivergentConditions: [],
            commitment: '',
          }
        }
      ])),
      deleteMentorsMenteeLink: jest.fn().mockReturnValue(of({})),
    } as unknown as jest.Mocked<MenteeMentorLinkRepositoryService>;

    userServiceMock = {
      $userDetails: jest.fn().mockReturnValue({
        id: 'mentor1',
        accountId: 'acc123',
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
      })
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [MyMenteesPageComponent],
      providers: [
        { provide: MenteeMentorLinkRepositoryService, useValue: menteeMentorLinkRepositoryMock },
        { provide: UserService, useValue: userServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MyMenteesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mentees on init', () => {
    expect(menteeMentorLinkRepositoryMock.getMentorsMenteesByUserId).toHaveBeenCalledWith('mentor1');
    expect(component.$mentees().length).toBeGreaterThan(0);
  });

  it('should call deleteMentorsMenteeLink and reload mentees in endMentorship', () => {
    // prepare
    menteeMentorLinkRepositoryMock.getMentorsMenteesByUserId.mockReturnValueOnce(of([])); // after reload
    component.endMentorship('mentee1');
    expect(menteeMentorLinkRepositoryMock.deleteMentorsMenteeLink).toHaveBeenCalledWith('mentor1', 'mentee1');
    expect(menteeMentorLinkRepositoryMock.getMentorsMenteesByUserId).toHaveBeenCalledTimes(2); // once on init, once after endMentorship
  });
});

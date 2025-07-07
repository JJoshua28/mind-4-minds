import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyMentorsPageComponent } from './my-mentors-page.component';
import { MenteeMentorLinkRepositoryService } from '../../../../shared/repositories/mentee-mentor-link.repository.service';
import { UserService } from '../../../../shared/services/user/user-service.service';
import { of } from 'rxjs';
import { MentorUser } from '../../../../types/user.interface';
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {UserType} from "../../../../types/user-type.enum";

describe('MyMentorsPageComponent', () => {
  let component: MyMentorsPageComponent;
  let fixture: ComponentFixture<MyMentorsPageComponent>;

  // create jest-mocked services
  let mockMenteeMentorLinkRepository: jest.Mocked<MenteeMentorLinkRepositoryService>;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(async () => {
    mockMenteeMentorLinkRepository = {
      getMenteesMentorsByUserId: jest.fn(),
      deleteMentorsMenteeLink: jest.fn(),
      getMenteesMentors: jest.fn(),
    } as unknown as jest.Mocked<MenteeMentorLinkRepositoryService>;

    mockUserService = {
      $userDetails: jest.fn().mockReturnValue({ id: 'user123' })
    } as unknown as jest.Mocked<UserService>;

    await TestBed.configureTestingModule({
      imports: [MyMentorsPageComponent],
      providers: [
        { provide: MenteeMentorLinkRepositoryService, useValue: mockMenteeMentorLinkRepository },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyMentorsPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load mentors on init', () => {
    const dummyMentors: MentorUser[] = [{
      id: "mentor-user-id-123",
      accountId: "account-456",
      isAdmin: false,
      joined: "2024-06-01T12:00:00Z",
      roles: [UserType.MENTOR],
      isArchived: false,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      occupation: "Software Engineer",
      occupationStartDate: "2018-01-01",
      profilePic: "https://example.com/alice.png",
      mentorDetails: {
        id: "mentor-details-789",
        isAvailable: true,
        description: "Experienced software mentor",
        qualifications: "BSc Computer Science",
        experience: "5 years mentoring experience",
        commitment: "2 hours per week",
        meetingPreferences: [MeetingPreferences.VIDEO_CALLS, MeetingPreferences.ONLINE_MESSAGING],
        neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.DYSLEXIA],
      },
    }];

    mockMenteeMentorLinkRepository.getMenteesMentorsByUserId.mockReturnValue(of(dummyMentors));

    fixture.detectChanges();

    expect(component.$mentors()).toEqual(dummyMentors);
    expect(mockMenteeMentorLinkRepository.getMenteesMentorsByUserId)
      .toHaveBeenCalledWith('user123');
  });

  it('should end mentorship and refresh mentors', (done) => {
    const afterDeleteMentors: MentorUser[] = [{
      id: "mentor-user-id-123",
      accountId: "account-456",
      isAdmin: false,
      joined: "2024-06-01T12:00:00Z",
      roles: [UserType.MENTOR],
      isArchived: false,
      firstName: "Alice",
      lastName: "Smith",
      email: "alice.smith@example.com",
      occupation: "Software Engineer",
      occupationStartDate: "2018-01-01",
      profilePic: "https://example.com/alice.png",
      mentorDetails: {
        id: "mentor-details-789",
        isAvailable: true,
        description: "Experienced software mentor",
        qualifications: "BSc Computer Science",
        experience: "5 years mentoring experience",
        commitment: "2 hours per week",
        meetingPreferences: [MeetingPreferences.VIDEO_CALLS, MeetingPreferences.ONLINE_MESSAGING],
        neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.DYSLEXIA],
      },
    }];


    mockMenteeMentorLinkRepository.deleteMentorsMenteeLink.mockReturnValue(of({deleted: 'mentor1'}));
    mockMenteeMentorLinkRepository.getMenteesMentors.mockReturnValue(of(afterDeleteMentors));

    component.endMentorship('mentor1');

    // simulate subscriptions after pipe
    setTimeout(() => {
      expect(mockMenteeMentorLinkRepository.deleteMentorsMenteeLink)
        .toHaveBeenCalledWith('mentor1', 'user123');

      expect(mockMenteeMentorLinkRepository.getMenteesMentors)
        .toHaveBeenCalledWith('user123');

      expect(component.$mentors()).toEqual(afterDeleteMentors);

      done();
    }, 0);
  });
});

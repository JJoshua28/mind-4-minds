import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RegistrationService} from '../../registration.service';
import {MenteeDetails} from '../../../../types/user details/mentee.interface';
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {RegisterMenteeDetailsPageComponent} from "./register-mentee-details-page.component";

const validMenteeDetails: MenteeDetails = {
  description: 'Some text',
  goals: ['Learn Angular'],
  learningPreferences: [LearningPreferences.KINESTHETIC],
  expectations: 'Be the best mentee!',
  neurodivergentConditions: [],
  meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING],
  commitment: 'Weekly'
};

const invalidMenteeDetails: MenteeDetails = {
  description: '',
  goals: [],
  learningPreferences: [],
  expectations: '',
  neurodivergentConditions: [],
  meetingPreferences: [],
  commitment: ''
};

describe('RegisterMenteeDetailsPageComponent', () => {
  let component: RegisterMenteeDetailsPageComponent;
  let fixture: ComponentFixture<RegisterMenteeDetailsPageComponent>;

  function setupTest(menteeDetails: MenteeDetails) {
    return TestBed.configureTestingModule({
      imports: [RegisterMenteeDetailsPageComponent],
      providers: [
        {
          provide: RegistrationService,
          useValue: {
            menteeDetails,
            addMenteeDetails: jest.fn()
          }
        }
      ]
    }).compileComponents();
  }

  it('should hide Save button when form is invalid', async () => {
    await setupTest(invalidMenteeDetails);

    fixture = TestBed.createComponent(RegisterMenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('continue-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('hidden');
  });

  it('should show Save button when form is valid', async () => {
    await setupTest(validMenteeDetails);

    fixture = TestBed.createComponent(RegisterMenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.continue-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('visible');
  });
});

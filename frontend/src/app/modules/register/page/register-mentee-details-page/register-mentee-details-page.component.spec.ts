import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {RegisterMenteeDetailsPageComponent} from './register-mentee-details-page.component';
import {RegistrationService} from '../../registration.service';
import {MenteeInfo} from '../../../../types/user details/user-info.interface';
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {signal} from "@angular/core";

const validMenteeDetails: MenteeInfo = {
  description: 'Some text',
  goals: ['Learn Angular'],
  learningPreferences: [ LearningPreferences.KINESTHETIC ],  // adjust if enum imported
  expectations: 'Be the best mentee!',
  neurodivergentConditions: [],
  meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING],
  commitment: 'Weekly'
};

const invalidMenteeDetails: MenteeInfo = {
  description: '',
  goals: [],
  learningPreferences: [],
  expectations: '',
  neurodivergentConditions: [],
  meetingPreferences: [],
  commitment: ''
};

describe('RegisterMenteeDetailsPageComponent', () => {
  let fixture: ComponentFixture<RegisterMenteeDetailsPageComponent>;
  let component: RegisterMenteeDetailsPageComponent;
  let registrationServiceMock: Partial<RegistrationService>;

  async function setupTest(menteeDetails: MenteeInfo) {
    registrationServiceMock = {
      menteeDetails: signal(menteeDetails),
      addMenteeDetails: jest.fn(),
      navigateToNextSection: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterMenteeDetailsPageComponent],
      providers: [
        { provide: RegistrationService, useValue: registrationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should hide Save button when form is invalid', async () => {
    await setupTest(invalidMenteeDetails);

    const saveButton = fixture.debugElement.query(By.css('.continue-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('hidden');
  });

  it('should show Save button when form is valid', async () => {
    await setupTest(validMenteeDetails);

    const saveButton = fixture.debugElement.query(By.css('.continue-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('visible');
  });
});

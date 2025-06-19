import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditMenteeDetailsPageComponent} from './edit-mentee-details-page.component';
import {By} from '@angular/platform-browser';

import {MenteeInfo} from "../../../../types/user details/user-info.interface";
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";

import {RegistrationService} from '../../../register/registration.service';

const validMenteeDetails: MenteeInfo = {
  description: 'Some text',
  goals: ['Learn Angular'],
  learningPreferences: [LearningPreferences.KINESTHETIC],
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

describe('EditMenteeDetailsPageComponent', () => {
  let component: EditMenteeDetailsPageComponent;
  let fixture: ComponentFixture<EditMenteeDetailsPageComponent>;

  function setupTest(menteeDetails: MenteeInfo) {
    return TestBed.configureTestingModule({
      imports: [EditMenteeDetailsPageComponent],
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

    fixture = TestBed.createComponent(EditMenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.save-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('hidden');
  });

  it('should show Save button when form is valid', async () => {
    await setupTest(validMenteeDetails);

    fixture = TestBed.createComponent(EditMenteeDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('.save-button')).nativeElement;
    expect(saveButton.style.visibility).toBe('visible');
  });
});

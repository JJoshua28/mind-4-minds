import {ComponentFixture, TestBed} from '@angular/core/testing';
import {EditMenteeDetailsPageComponent} from './edit-mentee-details-page.component';
import {By} from '@angular/platform-browser';
import {RegistrationService} from '../../../register/registration.service';
import {MenteeDetails} from '../../../../types/user details/mentee.interface';
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";

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

describe('EditMenteeDetailsPageComponent', () => {
  let component: EditMenteeDetailsPageComponent;
  let fixture: ComponentFixture<EditMenteeDetailsPageComponent>;

  function setupTest(menteeDetails: MenteeDetails) {
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

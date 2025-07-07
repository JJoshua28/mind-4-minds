import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterMentorDetailsPageComponent } from './register-mentor-details-page.component';
import { RegistrationService } from '../../registration.service';
import { MeetingPreferences } from '../../../../types/user details/mentor/mentor.enum';
import { NeurodivergenceConditions } from '../../../../types/user details/neurodivergence.enum';
import { ComponentRef } from '@angular/core';

describe('RegisterMentorDetailsPageComponent (Jest)', () => {
  let component: RegisterMentorDetailsPageComponent;
  let fixture: ComponentFixture<RegisterMentorDetailsPageComponent>;
  let componentRef: ComponentRef<RegisterMentorDetailsPageComponent>;

  let mockRegistrationService: {
    mentorDetails: jest.Mock;
    userDetails: jest.Mock;
    addMentorDetails: jest.Mock;
    navigateToNextSection: jest.Mock;
  };

  const mockMentorDetails = {
    description: 'Test desc',
    qualifications: 'Test quals',
    commitment: 'Test commitment',
    experience: 'Test experience',
    meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING],
    neurodivergentConditions: [NeurodivergenceConditions.ADHD]
  };

  const mockUserDetails = {
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@example.com',
    occupation: 'Engineer',
    occupationStartDate: '2022-01-01',
    profilePic: new File([''], 'photo.jpg', { type: 'image/jpeg' })
  };

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn(() => 'mock-object-url');
  });

  beforeEach(async () => {
    mockRegistrationService = {
      mentorDetails: jest.fn(() => mockMentorDetails),
      userDetails: jest.fn(() => mockUserDetails),
      addMentorDetails: jest.fn(),
      navigateToNextSection: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RegisterMentorDetailsPageComponent, ReactiveFormsModule],
      providers: [
        { provide: RegistrationService, useValue: mockRegistrationService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterMentorDetailsPageComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with mentor details from RegistrationService', () => {
    const form = component.$mentorDetailsForm();
    expect(form.value.description).toBe('Test desc');
    expect(form.value.qualifications).toBe('Test quals');
    expect(form.value.commitment).toBe('Test commitment');
  });

  it('should recompute $user signal when form values change', () => {
    const form = component.$mentorDetailsForm();

    form.get('description')?.setValue('Updated desc');
    fixture.detectChanges();

    const user = component.$user();
    expect(user.description).toBe('Updated desc');
    expect(user.firstName).toBe('Jane');
    expect(user.meetingPreferences).toContain(MeetingPreferences.ONLINE_MESSAGING);
    expect(user.neurodivergentConditions).toContain(NeurodivergenceConditions.ADHD);
  });

  it('should call addMentorDetails and navigateToNextSection on submit', () => {
    component.submitRegistrationMentor();

    expect(mockRegistrationService.addMentorDetails).toHaveBeenCalled();

    // Confirm it was called with meeting preferences & neurodivergent conditions arrays
    const callArg = mockRegistrationService.addMentorDetails.mock.calls[0][0];
    expect(callArg.meetingPreferences).toContain(MeetingPreferences.ONLINE_MESSAGING);
    expect(callArg.neurodivergentConditions).toContain(NeurodivergenceConditions.ADHD);

    expect(mockRegistrationService.navigateToNextSection).toHaveBeenCalled();
  });

  it('should unsubscribe subscriptions on destroy', () => {
    const unsubscribeSpy = jest.spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});

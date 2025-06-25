import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMentorModalComponent } from './view-mentor-modal.component';
import {ComponentRef, signal} from "@angular/core";

import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../types/user details/neurodivergence.enum";

describe('ViewUserModalComponent', () => {
  let component: ViewMentorModalComponent;
  let componentRef: ComponentRef<ViewMentorModalComponent>;
  let fixture: ComponentFixture<ViewMentorModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMentorModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMentorModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('$userInfo', {
      firstname: "vorname",
      email: "vorname@gmail.com",
      surname: "nachname",
      occupation: "carer",
      occupationStartDate: new Date(5).toDateString(),
      profilePic: "img",
    });

    componentRef.setInput('$mentorInfo', {
      meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
      qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.TOURETTES, NeurodivergenceConditions.AUTISM, NeurodivergenceConditions.DYSLEXIA, NeurodivergenceConditions.DYSCALCULIA],
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
    })



      fixture.detectChanges();

  })
  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });


    describe('When the modal is shown', () => {
      beforeEach(async () => {
        component.show()
        component.modal = fixture.nativeElement.querySelector('dialog')

        await fixture.whenStable();
        fixture.detectChanges();
      })
      it('should be not be hidden', () => {
        const componentContainer = fixture.nativeElement.querySelector('main');
        expect(componentContainer.classList).not.toContain("hidden-modal-container");
      });
    });
});

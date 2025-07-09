import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMenteeModalComponent } from './view-mentee-modal.component';
import {ComponentRef, signal} from "@angular/core";

import {MeetingPreferences} from "../../../types/user details/mentor/mentor.enum";
import {LearningPreferences} from "../../../types/user details/learning-preferences.enum";

describe('ViewUserModalComponent', () => {
  let component: ViewMenteeModalComponent;
  let componentRef: ComponentRef<ViewMenteeModalComponent>;
  let fixture: ComponentFixture<ViewMenteeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewMenteeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMenteeModalComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput('$_userInfo', {
      firstname: "vorname",
      email: "vorname@gmail.com",
      surname: "nachname",
      occupation: "carer",
      occupationStartDate: new Date(5).toDateString(),
      profilePic: "img",
    });

    componentRef.setInput("$menteeInfo", {
      description: 'Some text',
      goals: ['Learn Angular'],
      learningPreferences: [LearningPreferences.KINESTHETIC],
      expectations: 'Be the best mentee!',
      neurodivergentConditions: [],
      meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING],
      commitment: 'Weekly'
    });

    fixture.detectChanges();

  })
  beforeAll(() => {
    HTMLDialogElement.prototype.show = jest.fn();
    HTMLDialogElement.prototype.showModal = jest.fn();
    HTMLDialogElement.prototype.close = jest.fn();
  });


    it('should be hidden by default', () => {
      component.isHidden = signal(true)
      const componentContainer = fixture.nativeElement.querySelector('main');
      expect(componentContainer.classList).toContain("hidden-modal-container");

    });
    describe('When the modal is shown', () => {
      beforeEach(async () => {
        component.show()
        component.isHidden = signal(false)
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

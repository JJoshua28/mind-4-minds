import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationsSnippetComponent } from './communications-snippet.component';
import {v4 as uuidv4} from "uuid";
import {CommunicationsStatus} from "../../../../types/communications-status.enum";
import {ComponentRef} from "@angular/core";

describe('MessageSnippetComponent', () => {
  let component: CommunicationsSnippetComponent;
  let fixture: ComponentFixture<CommunicationsSnippetComponent>;
  let componentRef: ComponentRef<CommunicationsSnippetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationsSnippetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicationsSnippetComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    componentRef.setInput("$message",  {
      id: uuidv4(),
      senderName: "Vorname Nachname",
      message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      subject: "Lorem ipsum dolor sit amet.",
      date: new Date().toLocaleString('en-GB', {
        dateStyle: "short",
        timeStyle: 'short'
      }),
      status: CommunicationsStatus.NEW,
      isChecked: false
    },)

    fixture.detectChanges();
  });

  it('should display a bullet icon if its a new message', () => {
    const bulletIcon = fixture.nativeElement.querySelector(".bullet-icon");
    const visibility = getComputedStyle(bulletIcon).visibility;

    expect(visibility).toBe("visible");
  });
  it('should display a bold subject heading if its a new message', () => {
    expect(fixture.nativeElement.querySelector(".snippet-subject")).toBeTruthy();
  });
  describe("Given an old message", () => {
    beforeEach(async () => {
      componentRef.setInput("$message",  {
        id: uuidv4(),
        senderName: "Vorname Nachname",
        message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        subject: "Lorem ipsum dolor sit amet.",
        date: new Date().toLocaleString('en-GB', {
          dateStyle: "short",
          timeStyle: 'short'
        }),
        status: CommunicationsStatus.OLD,
        isChecked: false
      })

      fixture.detectChanges();
    })

    it('should NOT display a bullet icon if its a new message', () => {
      const bulletIcon = fixture.nativeElement.querySelector(".bullet-icon");
      const visibility = getComputedStyle(bulletIcon).visibility;

      expect(visibility).toBe("hidden");
    });
    it('should display a subject in bold heading if its a new message', () => {
      expect(fixture.nativeElement.querySelector(".snippet-subject")).toBeFalsy();
    });
  })
});

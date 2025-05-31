import {Component, inject, input} from '@angular/core';
import {Router} from "@angular/router";
import {MeetingPreferences, Specialities} from "../../../../types/user details/mentor/mentor.enum";


@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent {
  private readonly _router = inject(Router);

  mentorDetails = input({
    meetingPreference: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
    mainSpeciality: Specialities.adhd,
    qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    specialities: [Specialities.adhd, Specialities.leadership, Specialities.assessment],
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
      "I have experience helping him self-regulate and vibe.",
    isAvailable: false,
  })

  navigateTo() {
    this._router.navigate(['/profile/mentor-details/edit']);
  }

}

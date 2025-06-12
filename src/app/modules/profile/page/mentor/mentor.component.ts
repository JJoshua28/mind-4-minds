import {Component, inject, input} from '@angular/core';
import {Router} from "@angular/router";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {Mentor} from "../../../../types/user details/mentor/mentor.interface";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";


@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [
    MentorDetailsComponent
  ],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent {
  private readonly _router = inject(Router);

  $mentorDetails = input<Mentor>({
    id: "1",
    meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
    qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.TOURETTES, NeurodivergenceConditions.AUTISM],
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
      "I have experience helping him self-regulate and vibe.",
    isAvailable: false,
  })

  navigateTo() {
    this._router.navigate(['/profile/mentor-details/edit']);
  }

}

import {Component, inject, input, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";

import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import {MentorUser} from "../../../../types/user.interface";
import {PreviewMentorCardComponent} from "../../components/preview-mentor-card/preview-mentor-card.component";

@Component({
  selector: 'app-mentor',
  standalone: true,
  imports: [
    MentorDetailsComponent,
    PreviewMentorCardComponent
  ],
  templateUrl: './mentor.component.html',
  styleUrl: './mentor.component.scss'
})
export class MentorComponent {
  private readonly _router = inject(Router);
  @ViewChild(PreviewMentorCardComponent) previewMentormodal!: PreviewMentorCardComponent;



  $user = input<MentorUser>({
    id: "1",
    firstname: "vorname",
    email: "vorname@gmail.com",
    surname: "nachname",
    occupation: "carer",
    occupationStartDate: new Date(5),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg",
    mentorDetails: {
      id: "1",
      meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
      qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.TOURETTES, NeurodivergenceConditions.AUTISM, NeurodivergenceConditions.DYSLEXIA, NeurodivergenceConditions.DYSCALCULIA],
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      isAvailable: false,
    }
  })

  navigateTo() {
    this._router.navigate(['/profile/mentor-details/edit']);
  }

}

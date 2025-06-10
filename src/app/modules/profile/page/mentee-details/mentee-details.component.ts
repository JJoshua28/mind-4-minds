import {Component, inject, input} from '@angular/core';
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {Router} from "@angular/router";
import {Mentee} from "../../../../types/user details/mentee.interface";


const mentee = {
  description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
    "I have experience helping him self-regulate and vibe.",
  goals: ["Win, win, win win", "become a better person"],
  learningPreference: [LearningPreferences.KINESTHETIC, LearningPreferences.READING],
  expectations: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  meetingPreference: [MeetingPreferences.VIDEO_CALLS, MeetingPreferences.ONLINE_MESSAGING],
  neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.AUTISM],
  commitment: "I would like a programme for 6 weeks meeting twice a week"

}

@Component({
  selector: 'app-mentee-details',
  standalone: true,
  imports: [],
  templateUrl: './mentee-details.component.html',
  styleUrl: './mentee-details.component.scss'
})
export class MenteeDetailsComponent {
  private readonly _router = inject(Router);

  $mentee = input<Mentee>(mentee);

  navigateTo() {
    this._router.navigate(['/profile/mentee-details/edit']);
  }

}

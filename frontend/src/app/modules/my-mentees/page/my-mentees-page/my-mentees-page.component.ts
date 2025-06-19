import { Component } from '@angular/core';

import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {ListMentorsComponent} from "../../../my-mentors/components/list-users/list-mentors.component";
import {UserType} from "../../../../types/user-type.enum";
import {LearningPreferences} from "../../../../types/user details/learning-preferences.enum";
import {MenteeInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {ListMenteesComponent} from "../../components/list-users/list-mentees.component";

@Component({
  selector: 'app-my-mentees-page',
  standalone: true,
  imports: [
    ListMentorsComponent,
    ListMenteesComponent
  ],
  templateUrl: './my-mentees-page.component.html',
  styleUrl: './my-mentees-page.component.scss'
})
export class MyMenteesPageComponent {
  protected readonly noMentorsMessage = "No mentees to help yet. Sit tight or review your profile"
  protected readonly heading = "My mentees"
  protected isHoveringOnUserCard = false
  protected userType = UserType.MENTEE

  user: UserInfo & MenteeInfo = {
    firstName: "vorname",
    email: "vorname@gmail.com",
    lastName: "nachname",
    occupation: "carer",
    occupationStartDate: new Date(5).toDateString(),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg",
    description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      goals: ["Win, win, win win", "become a better person"],
      learningPreferences: [LearningPreferences.KINESTHETIC, LearningPreferences.READING],
      expectations: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      meetingPreferences: [MeetingPreferences.VIDEO_CALLS, MeetingPreferences.ONLINE_MESSAGING],
      neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.AUTISM],
      commitment: "I would like a programme for 6 weeks meeting twice a week"


  }

  users = [this.user, this.user, this.user,this.user,this.user,this.user,this.user,this.user];


}

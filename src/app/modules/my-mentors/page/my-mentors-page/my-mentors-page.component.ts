import { Component } from '@angular/core';
import {ListUsersComponent} from "../../../../shared/component/list-users/list-users.component";
import {User} from "../../../../types/user.interface";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {NgClass} from "@angular/common";
import {UserType} from "../../../../types/user-type.enum";

@Component({
  selector: 'app-my-mentors-page',
  standalone: true,
  imports: [
    ListUsersComponent,
    NgClass
  ],
  templateUrl: './my-mentors-page.component.html',
  styleUrl: './my-mentors-page.component.scss'
})
export class MyMentorsPageComponent {
  protected readonly noMentorsMessage = "Reflect on what you want from a mentorship and find a mentor"
  protected readonly heading = "My mentors"
  protected isHoveringOnUserCard = false
  protected userType = UserType.MENTOR


  user: User = {
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
  }

  users: User[] = [this.user, this.user, this.user,this.user,this.user,this.user,this.user,this.user];


}

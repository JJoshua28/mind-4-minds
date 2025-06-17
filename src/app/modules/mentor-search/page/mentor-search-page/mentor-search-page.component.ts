import {Component, signal, ViewChild, WritableSignal} from '@angular/core';

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {ViewMentorModalComponent} from "../../components/view-mentor-modal/view-mentor-modal.component";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MentorUser, User} from "../../../../types/user.interface";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NgClass} from "@angular/common";
import {UserType} from "../../../../types/user-type.enum";

@Component({
  selector: 'app-mentor-search-page',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass
  ],
  templateUrl: './mentor-search-page.component.html',
  styleUrl: './mentor-search-page.component.scss'
})
export class MentorSearchPageComponent {
  @ViewChild(ViewMentorModalComponent) modal!: ViewMentorModalComponent;

  user: MentorUser = {
    id: "1",
    firstName: "vorname",
    email: "vorname@gmail.com",
    lastName: "nachname",
    occupation: "carer",
    isArchived: false,
    occupationStartDate: new Date(5).toDateString(),
    profilePic: "https://cdn.britannica.com/54/252154-050-881EE55B/janelle-monae-glass-onion-knives-out-film-premiere.jpg",
    mentorDetails: {
      id: "1",
      commitment: "Once a week for two weeks",
      meetingPreferences: [MeetingPreferences.ONLINE_MESSAGING, MeetingPreferences.VIDEO_CALLS],
      qualifications: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      experience: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.TOURETTES, NeurodivergenceConditions.AUTISM, NeurodivergenceConditions.DYSLEXIA, NeurodivergenceConditions.DYSCALCULIA],
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      isAvailable: false,
    }
  }

  placeholderMentors: MentorUser[] = [this.user, this.user, this.user,this.user,this.user,this.user,this.user,this.user];

  mentorUserMapInfo(user: MentorUser) {
    const { mentorDetails, menteeDetails, isArchived, id, ...userInfo } = user;
    const { id: mentorId, isAvailable, ...mentorInfo } = mentorDetails;

    return {
      ...userInfo,
      ...mentorInfo
    };
  }

  $selectedUser: WritableSignal<User> = signal(this.placeholderMentors[0]);

  protected readonly UserType = UserType;
}

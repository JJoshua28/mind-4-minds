import {Component, ElementRef, signal, ViewChild, WritableSignal} from '@angular/core';
import {NgClass} from "@angular/common";
import {User} from "../../../../types/user.interface";
import {MeetingPreferences} from "../../../../types/user details/mentor/mentor.enum";
import {NeurodivergenceConditions} from "../../../../types/user details/neurodivergence.enum";
import {MenteeDetailsComponent} from "../../../../shared/component/mentee-details/mentee-details.component";
import {MentorDetailsComponent} from "../../../../shared/component/mentor-details/mentor-details.component";
import { experienceDuration } from '../../../../shared/helpers/experienceDurations';

@Component({
  selector: 'app-view-mentor-modal',
  standalone: true,
  imports: [
    NgClass,
    MenteeDetailsComponent,
    MentorDetailsComponent
  ],
  templateUrl: './view-mentor-modal.component.html',
  styleUrl: './view-mentor-modal.component.scss'
})
export class ViewMentorModalComponent {
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  isHidden: WritableSignal<boolean>= signal(true);


  $user: WritableSignal<User> = signal({
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
      neurodivergentConditions: [NeurodivergenceConditions.ADHD, NeurodivergenceConditions.TOURETTES, NeurodivergenceConditions.AUTISM],
      description: "Hi, I am vorname. I have been caring for my Autistic son for 13 years now. \n" +
        "I have experience helping him self-regulate and vibe.",
      isAvailable: false,
    }
  })

  protected readonly experienceDuration = experienceDuration;

  show () {
    this.isHidden.set(!this.isHidden());
    this.modal.nativeElement.showModal()
  }

  close () {
    this.isHidden.set(!this.isHidden());

    this.modal.nativeElement.close();
  }

}

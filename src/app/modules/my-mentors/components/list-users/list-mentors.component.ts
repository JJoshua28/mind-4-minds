import {
  Component, computed,
  EventEmitter,
  input,
  OnInit,
  Output, Signal,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {
    ViewMentorModalComponent
} from "../../../mentor-search/components/view-mentor-modal/view-mentor-modal.component";


import {NgClass} from "@angular/common";
import {UserType} from "../../../../types/user-type.enum";
import {ActionTypes, ConfirmActionModalComponent} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import { MentorInfo, UserInfo} from "../../../../types/user details/user-info.interface";

@Component({
  selector: 'app-list-mentors',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass,
    ConfirmActionModalComponent
  ],
  templateUrl: './list-mentors.component.html',
  styleUrl: './list-mentors.component.scss'
})
export class ListMentorsComponent implements OnInit {
  @Output() isHoveringOnUserCard = new EventEmitter<boolean>();

  @ViewChild(ViewMentorModalComponent) viewUserModal!: ViewMentorModalComponent;
  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;


  $heading = input.required<string>();
  $users = input.required<(UserInfo & MentorInfo)[]>();
  $userType = input.required<UserType>();

  $noConnectionsMessage = input.required<string>();

  $selectedUser!: WritableSignal<(UserInfo & MentorInfo)>;

  mapUserCardInfo (user: UserInfo & MentorInfo) {
    const {
      firstName,
      lastName,
      email,
      profilePic,
      description,
      occupation,
      neurodivergentConditions,
      occupationStartDate,

    } = user;

    return {
      firstName,
      lastName,
      email,
      profilePic,
      description,
      occupation,
      neurodivergentConditions,
      occupationStartDate,
    }
  }

  $mentorInfo: Signal<MentorInfo>  = computed(() => {
    const {
      description,
      neurodivergentConditions,
      qualifications,
      experience,
      commitment,
      meetingPreferences
    } = this.$selectedUser();

    return {
      description,
      neurodivergentConditions,
      qualifications,
      experience,
      commitment,
      meetingPreferences
    }
  })

  protected readonly actionType =  ActionTypes.DELETE
  protected readonly modalMessageTopic = "end the mentorship"

  ngOnInit() {
    this.$selectedUser = signal(this.$users()[0]);
  }


}

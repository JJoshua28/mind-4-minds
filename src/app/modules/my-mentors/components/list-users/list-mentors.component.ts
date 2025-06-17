import {
  Component, computed,
  EventEmitter,
  input, OnChanges,
  Output, Signal,
  signal, SimpleChanges,
  ViewChild,
  WritableSignal
} from '@angular/core';

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {
    ViewMentorModalComponent
} from "../../../../shared/component/view-mentor-modal/view-mentor-modal.component";


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
export class ListMentorsComponent implements OnChanges {
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
      profilePic,
      description,
      occupation,
      neurodivergentConditions,
      occupationStartDate,

    } = user;

    return {
      firstName,
      lastName,
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

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["$users"]) {
      this.$selectedUser = signal(changes["$users"].currentValue[0]);
    }
  }


}

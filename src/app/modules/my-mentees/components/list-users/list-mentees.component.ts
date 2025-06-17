import {
  Component, computed,
  EventEmitter,
  input, OnChanges,
  Output, Signal,
  signal, SimpleChanges,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {NgClass} from "@angular/common";

import {MenteeInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {UserType} from "../../../../types/user-type.enum";

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";

import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";
import {ViewMenteeModalComponent} from "../../../../shared/component/view-mentee-modal/view-mentee-modal.component";

@Component({
  selector: 'app-list-mentees',
  standalone: true,
  imports: [
    UserCardComponent,
    NgClass,
    ConfirmActionModalComponent,
    ViewMenteeModalComponent
  ],
  templateUrl: './list-mentees.component.html',
  styleUrl: './list-mentees.component.scss'
})
export class ListMenteesComponent implements OnChanges {
  @Output() isHoveringOnUserCard = new EventEmitter<boolean>();

  @ViewChild(ViewMenteeModalComponent) viewUserModal!: ViewMenteeModalComponent;
  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;

  $heading = input.required<string>();
  $users = input.required<(UserInfo & MenteeInfo)[]>();
  $userType = input.required<UserType>();

  $noConnectionsMessage = input.required<string>();

  $selectedUser!: WritableSignal<(UserInfo & MenteeInfo)>;

  $menteeInfo: Signal<MenteeInfo>  = computed(() => {
    const {
      description,
      neurodivergentConditions,
      expectations,
      goals,
      learningPreferences,
      commitment,
      meetingPreferences
    } = this.$selectedUser();

    return {
      description,
      neurodivergentConditions,
      expectations,
      goals,
      learningPreferences,
      commitment,
      meetingPreferences
    }
  })

  mapUserCardInfo (user: UserInfo & MenteeInfo) {
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

  protected readonly actionType =  ActionTypes.DELETE
  protected readonly modalMessageTopic = "end the mentorship"

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["$users"]) {
      this.$selectedUser = signal(changes["$users"].currentValue[0]);
    }
  }
}

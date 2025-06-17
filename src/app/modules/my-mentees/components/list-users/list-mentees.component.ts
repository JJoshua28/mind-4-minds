import {
  Component,
  EventEmitter,
  input,
  OnInit,
  Output,
  signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {NgClass} from "@angular/common";

import {MenteeInfo, UserInfo} from "../../../../types/user details/user-info.interface";
import {UserType} from "../../../../types/user-type.enum";

import {UserCardComponent} from "../../../../shared/component/user-card/user-card.component";
import {
  ViewMentorModalComponent
} from "../../../mentor-search/components/view-mentor-modal/view-mentor-modal.component";
import {
  ActionTypes,
  ConfirmActionModalComponent
} from "../../../../shared/component/confirm-action-modal/confirm-action-modal.component";

@Component({
  selector: 'app-list-mentees',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass,
    ConfirmActionModalComponent
  ],
  templateUrl: './list-mentees.component.html',
  styleUrl: './list-mentees.component.scss'
})
export class ListMenteesComponent implements OnInit {
  @Output() isHoveringOnUserCard = new EventEmitter<boolean>();

  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;

  $heading = input.required<string>();
  $users = input.required<(UserInfo & MenteeInfo)[]>();
  $userType = input.required<UserType>();

  $noConnectionsMessage = input.required<string>();

  $selectedUser!: WritableSignal<(UserInfo & MenteeInfo)>;

  mapUserCardInfo (user: UserInfo & MenteeInfo) {
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

  protected readonly actionType =  ActionTypes.DELETE
  protected readonly modalMessageTopic = "end the mentorship"

  ngOnInit() {
    this.$selectedUser = signal(this.$users()[0]);
  }
}

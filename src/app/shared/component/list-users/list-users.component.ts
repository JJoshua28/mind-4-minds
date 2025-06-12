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

import {UserCardComponent} from "../user-card/user-card.component";
import {
    ViewMentorModalComponent
} from "../../../modules/mentor-search/components/view-mentor-modal/view-mentor-modal.component";
import {User} from "../../../types/user.interface";

import {NgClass} from "@angular/common";
import {UserType} from "../../../types/user-type.enum";
import {ActionTypes, ConfirmActionModalComponent} from "../confirm-action-modal/confirm-action-modal.component";

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass,
    ConfirmActionModalComponent
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {
  @Output() isHoveringOnUserCard = new EventEmitter<boolean>();

  @ViewChild(ViewMentorModalComponent) viewUserModal!: ViewMentorModalComponent;
  @ViewChild(ConfirmActionModalComponent) confirmActionModal!: ConfirmActionModalComponent;


  $heading = input.required<string>();
  $users = input.required<User[]>();
  $userType = input.required<UserType>();


  $noConnectionsMessage = input.required<string>();

  $selectedUser!: WritableSignal<User>;

  protected readonly actionType =  ActionTypes.DELETE
  protected readonly modalMessageTopic = "end the mentorship"

  ngOnInit() {
    this.$selectedUser = signal(this.$users()[0]);
  }


}

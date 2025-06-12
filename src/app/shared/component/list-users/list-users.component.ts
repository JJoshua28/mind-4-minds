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

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    UserCardComponent,
    ViewMentorModalComponent,
    NgClass
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.scss'
})
export class ListUsersComponent implements OnInit {
  @Output() isHoveringOnUserCard = new EventEmitter<boolean>();

  @ViewChild(ViewMentorModalComponent) modal!: ViewMentorModalComponent;

  $heading = input.required<string>();
  $users = input.required<User[]>();

  $noConnectionsMessage = input.required<string>();

  $selectedUser!: WritableSignal<User>;

  ngOnInit() {
    this.$selectedUser = signal(this.$users()[0]);
  }


}
